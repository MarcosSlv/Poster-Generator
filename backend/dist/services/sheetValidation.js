"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSheet = exports.isFilled = exports.REQUIRED_FIELDS = exports.MAX_ROWS = void 0;
exports.MAX_ROWS = 200;
exports.REQUIRED_FIELDS = {
    default: ["produto", "preco", "medida"],
    combo: ["produto", "medida", "comboQtd"]
};
const isFilled = (value) => (typeof value === "string" || typeof value === "number") && String(value).trim() !== "";
exports.isFilled = isFilled;
const validateSheet = (sheet, requiredFields) => {
    if (!Array.isArray(sheet) || sheet.length === 0) {
        return { ok: false, message: "Nenhum item foi enviado para a criação dos cartazes." };
    }
    if (sheet.length > exports.MAX_ROWS) {
        return { ok: false, message: `Limite de ${exports.MAX_ROWS} cartazes por requisição excedido.` };
    }
    const rowsAreValid = sheet.every((item) => item !== null &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        requiredFields.every((field) => (0, exports.isFilled)(item[field])));
    if (!rowsAreValid) {
        return { ok: false, message: "Verifique se o conteúdo enviado na planilha está correto" };
    }
    return { ok: true };
};
exports.validateSheet = validateSheet;
