"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJson = exports.isGeminiConfigured = exports.GeminiRequestError = exports.GeminiRateLimitError = exports.GeminiNotConfiguredError = void 0;
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-flash-lite-latest";
const REQUEST_TIMEOUT_MS = 60000;
const MAX_OUTPUT_TOKENS = 16384;
class GeminiNotConfiguredError extends Error {
    constructor() {
        super("Assistente não configurado: defina GEMINI_API_KEY.");
        this.name = "GeminiNotConfiguredError";
    }
}
exports.GeminiNotConfiguredError = GeminiNotConfiguredError;
class GeminiRateLimitError extends Error {
    constructor() {
        super("Assistente ocupado no momento. Tente novamente em instantes.");
        this.name = "GeminiRateLimitError";
    }
}
exports.GeminiRateLimitError = GeminiRateLimitError;
class GeminiRequestError extends Error {
    constructor(detail) {
        super(detail);
        this.name = "GeminiRequestError";
    }
}
exports.GeminiRequestError = GeminiRequestError;
const apiKey = () => { var _a; return ((_a = process.env.GEMINI_API_KEY) !== null && _a !== void 0 ? _a : "").trim(); };
const isGeminiConfigured = () => apiKey() !== "";
exports.isGeminiConfigured = isGeminiConfigured;
const model = () => { var _a; return ((_a = process.env.GEMINI_MODEL) !== null && _a !== void 0 ? _a : "").trim() || DEFAULT_MODEL; };
const extractText = (payload) => {
    var _a, _b, _c, _d, _e;
    if ((_a = payload.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
        throw new GeminiRequestError(`Conteúdo bloqueado pelo provedor: ${payload.promptFeedback.blockReason}`);
    }
    const candidate = (_b = payload.candidates) === null || _b === void 0 ? void 0 : _b[0];
    if ((candidate === null || candidate === void 0 ? void 0 : candidate.finishReason) === "MAX_TOKENS") {
        throw new GeminiRequestError("A lista é longa demais para uma resposta única.");
    }
    const text = (_e = (_d = (_c = candidate === null || candidate === void 0 ? void 0 : candidate.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
    if (!text) {
        throw new GeminiRequestError("O provedor devolveu uma resposta vazia.");
    }
    return text;
};
const generateJson = (_a) => __awaiter(void 0, [_a], void 0, function* ({ systemInstruction, userText, responseSchema }) {
    const key = apiKey();
    if (key === "") {
        throw new GeminiNotConfiguredError();
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response;
    try {
        response = yield fetch(`${ENDPOINT}/${model()}:generateContent`, {
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
    }
    catch (e) {
        if (e instanceof Error && e.name === "AbortError") {
            throw new GeminiRequestError("O assistente demorou demais para responder.");
        }
        throw new GeminiRequestError("Não foi possível falar com o assistente.");
    }
    finally {
        clearTimeout(timer);
    }
    if (response.status === 429) {
        throw new GeminiRateLimitError();
    }
    if (!response.ok) {
        console.error("Gemini respondeu", response.status, yield response.text().catch(() => ""));
        throw new GeminiRequestError("O assistente respondeu com erro.");
    }
    const text = extractText((yield response.json()));
    try {
        return JSON.parse(text);
    }
    catch (_b) {
        throw new GeminiRequestError("O assistente devolveu um formato inesperado.");
    }
});
exports.generateJson = generateJson;
