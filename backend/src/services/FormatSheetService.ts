import { generateJson } from "./geminiClient";
import { RESPONSE_SCHEMA, SYSTEM_INSTRUCTION } from "./assistantPrompt";
import { MAX_ROWS, REQUIRED_FIELDS, isFilled, validateSheet } from "./sheetValidation";

const COMBO_TOTAL = 10;
const COMBO_TOLERANCE = 0.1;

export type AssistantKind = "promocional" | "combo";
export type AssistantRow = Record<string, string>;
export type AssistantBlock = { tipo: AssistantKind; linhas: AssistantRow[] };
export type FormatSheetResult = { blocos: AssistantBlock[]; avisos: string[] };

type RawRow = {
  tipo?: string;
  produto?: string;
  medida?: string;
  preco?: string;
  limite?: string;
  comboVlr?: string;
  comboQtd?: string;
};

const FIELD_LABELS: Record<string, string> = {
  produto: "produto",
  medida: "medida",
  preco: "preço",
  comboQtd: "quantidade do combo"
};

const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizePrice = (value: unknown) => {
  const text = clean(value).replace(/[^\d.,]/g, "");

  if (text === "") {
    return "";
  }

  const normalized = text.includes(",") ? text.replace(/\./g, "").replace(",", ".") : text;
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return "";
  }

  return parsed.toFixed(2).replace(".", ",");
};

const normalizeQuantity = (value: unknown) => clean(value).replace(/\D/g, "");

const normalizeMeasure = (value: unknown) => {
  const text = clean(value).toUpperCase();

  return text === "KG" || text === "UN" ? text : "";
};

const toRow = (raw: RawRow): { tipo: AssistantKind; linha: AssistantRow } => {
  const produto = clean(raw.produto);
  const medida = normalizeMeasure(raw.medida);

  if (raw.tipo === "combo") {
    return {
      tipo: "combo",
      linha: { produto, medida, comboVlr: normalizePrice(raw.comboVlr), comboQtd: normalizeQuantity(raw.comboQtd) }
    };
  }

  return {
    tipo: "promocional",
    linha: { produto, medida, preco: normalizePrice(raw.preco), limite: clean(raw.limite) }
  };
};

const describeRow = (linha: AssistantRow, position: number) =>
  linha.produto !== "" ? linha.produto : `linha ${position}`;

const missingFields = (tipo: AssistantKind, linha: AssistantRow) =>
  (tipo === "combo" ? REQUIRED_FIELDS.combo : REQUIRED_FIELDS.default)
    .filter((field) => !isFilled(linha[field]))
    .map((field) => FIELD_LABELS[field] ?? field);

const comboIsOff = (linha: AssistantRow) => {
  const valor = Number(linha.comboVlr.replace(",", "."));
  const quantidade = Number(linha.comboQtd);

  if (!Number.isFinite(valor) || !Number.isFinite(quantidade) || quantidade === 0) {
    return false;
  }

  return Math.abs(valor * quantidade - COMBO_TOTAL) > COMBO_TOLERANCE;
};

export const formatSheetService = async (texto: string): Promise<FormatSheetResult> => {
  const payload = await generateJson<{ linhas?: RawRow[] }>({
    systemInstruction: SYSTEM_INSTRUCTION,
    userText: texto,
    responseSchema: RESPONSE_SCHEMA
  });

  const recebidas = Array.isArray(payload.linhas) ? payload.linhas : [];
  const avisos: string[] = [];

  if (recebidas.length === 0) {
    return { blocos: [], avisos: ["Nenhuma oferta foi identificada no texto enviado."] };
  }

  if (recebidas.length > MAX_ROWS) {
    avisos.push(`Foram identificadas ${recebidas.length} ofertas: as primeiras ${MAX_ROWS} foram mantidas.`);
  }

  const grupos: Record<AssistantKind, AssistantRow[]> = { promocional: [], combo: [] };

  recebidas.slice(0, MAX_ROWS).forEach((raw, index) => {
    const { tipo, linha } = toRow(raw);
    const faltando = missingFields(tipo, linha);
    const descricao = describeRow(linha, index + 1);

    if (faltando.length > 0) {
      avisos.push(`${descricao}: não identifiquei ${faltando.join(", ")}. Linha descartada.`);
      return;
    }

    if (tipo === "combo" && comboIsOff(linha)) {
      avisos.push(`${descricao}: ${linha.comboQtd} x R$ ${linha.comboVlr} não fecha em R$ 10,00. Confira.`);
    }

    grupos[tipo].push(linha);
  });

  const blocos: AssistantBlock[] = [];

  (["promocional", "combo"] as AssistantKind[]).forEach((tipo) => {
    const linhas = grupos[tipo];

    if (linhas.length === 0) {
      return;
    }

    const validacao = validateSheet(linhas, tipo === "combo" ? REQUIRED_FIELDS.combo : REQUIRED_FIELDS.default);

    if (!validacao.ok) {
      avisos.push(validacao.message);
      return;
    }

    blocos.push({ tipo, linhas });
  });

  return { blocos, avisos };
};
