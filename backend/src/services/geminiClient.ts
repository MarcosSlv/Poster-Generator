const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-flash-lite-latest";
const REQUEST_TIMEOUT_MS = 60000;
const MAX_OUTPUT_TOKENS = 16384;

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super("Assistente não configurado: defina GEMINI_API_KEY.");
    this.name = "GeminiNotConfiguredError";
  }
}

export class GeminiRateLimitError extends Error {
  constructor() {
    super("Assistente ocupado no momento. Tente novamente em instantes.");
    this.name = "GeminiRateLimitError";
  }
}

export class GeminiRequestError extends Error {
  constructor(detail: string) {
    super(detail);
    this.name = "GeminiRequestError";
  }
}

type GenerateJsonParams = {
  systemInstruction: string;
  userText: string;
  responseSchema: Record<string, unknown>;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
};

const apiKey = () => (process.env.GEMINI_API_KEY ?? "").trim();

export const isGeminiConfigured = () => apiKey() !== "";

const model = () => (process.env.GEMINI_MODEL ?? "").trim() || DEFAULT_MODEL;

const extractText = (payload: GeminiResponse): string => {
  if (payload.promptFeedback?.blockReason) {
    throw new GeminiRequestError(`Conteúdo bloqueado pelo provedor: ${payload.promptFeedback.blockReason}`);
  }

  const candidate = payload.candidates?.[0];

  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new GeminiRequestError("A lista é longa demais para uma resposta única.");
  }

  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new GeminiRequestError("O provedor devolveu uma resposta vazia.");
  }

  return text;
};

export const generateJson = async <T>({ systemInstruction, userText, responseSchema }: GenerateJsonParams): Promise<T> => {
  const key = apiKey();

  if (key === "") {
    throw new GeminiNotConfiguredError();
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${ENDPOINT}/${model()}:generateContent`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          responseMimeType: "application/json",
          responseSchema
        }
      })
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new GeminiRequestError("O assistente demorou demais para responder.");
    }

    throw new GeminiRequestError("Não foi possível falar com o assistente.");
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 429) {
    throw new GeminiRateLimitError();
  }

  if (!response.ok) {
    console.error("Gemini respondeu", response.status, await response.text().catch(() => ""));

    throw new GeminiRequestError("O assistente respondeu com erro.");
  }

  const text = extractText((await response.json()) as GeminiResponse);

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new GeminiRequestError("O assistente devolveu um formato inesperado.");
  }
};
