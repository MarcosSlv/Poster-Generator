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
exports.formatSheetService = void 0;
const geminiClient_1 = require("./geminiClient");
const assistantPrompt_1 = require("./assistantPrompt");
const sheetValidation_1 = require("./sheetValidation");
const COMBO_TOTAL = 10;
const COMBO_TOLERANCE = 0.1;
const FIELD_LABELS = {
    produto: "produto",
    medida: "medida",
    preco: "preço",
    comboQtd: "quantidade do combo"
};
const clean = (value) => (typeof value === "string" ? value.trim() : "");
const normalizePrice = (value) => {
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
const normalizeQuantity = (value) => clean(value).replace(/\D/g, "");
const normalizeMeasure = (value) => {
    const text = clean(value).toUpperCase();
    return text === "KG" || text === "UN" ? text : "";
};
const toRow = (raw) => {
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
const describeRow = (linha, position) => linha.produto !== "" ? linha.produto : `linha ${position}`;
const missingFields = (tipo, linha) => (tipo === "combo" ? sheetValidation_1.REQUIRED_FIELDS.combo : sheetValidation_1.REQUIRED_FIELDS.default)
    .filter((field) => !(0, sheetValidation_1.isFilled)(linha[field]))
    .map((field) => { var _a; return (_a = FIELD_LABELS[field]) !== null && _a !== void 0 ? _a : field; });
const comboIsOff = (linha) => {
    const valor = Number(linha.comboVlr.replace(",", "."));
    const quantidade = Number(linha.comboQtd);
    if (!Number.isFinite(valor) || !Number.isFinite(quantidade) || quantidade === 0) {
        return false;
    }
    return Math.abs(valor * quantidade - COMBO_TOTAL) > COMBO_TOLERANCE;
};
const formatSheetService = (texto) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield (0, geminiClient_1.generateJson)({
        systemInstruction: assistantPrompt_1.SYSTEM_INSTRUCTION,
        userText: texto,
        responseSchema: assistantPrompt_1.RESPONSE_SCHEMA
    });
    const recebidas = Array.isArray(payload.linhas) ? payload.linhas : [];
    const avisos = [];
    if (recebidas.length === 0) {
        return { blocos: [], avisos: ["Nenhuma oferta foi identificada no texto enviado."] };
    }
    if (recebidas.length > sheetValidation_1.MAX_ROWS) {
        avisos.push(`Foram identificadas ${recebidas.length} ofertas: as primeiras ${sheetValidation_1.MAX_ROWS} foram mantidas.`);
    }
    const grupos = { promocional: [], combo: [] };
    recebidas.slice(0, sheetValidation_1.MAX_ROWS).forEach((raw, index) => {
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
    const blocos = [];
    ["promocional", "combo"].forEach((tipo) => {
        const linhas = grupos[tipo];
        if (linhas.length === 0) {
            return;
        }
        const validacao = (0, sheetValidation_1.validateSheet)(linhas, tipo === "combo" ? sheetValidation_1.REQUIRED_FIELDS.combo : sheetValidation_1.REQUIRED_FIELDS.default);
        if (!validacao.ok) {
            avisos.push(validacao.message);
            return;
        }
        blocos.push({ tipo, linhas });
    });
    return { blocos, avisos };
});
exports.formatSheetService = formatSheetService;
