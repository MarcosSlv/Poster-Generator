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
exports.formatSheet = exports.MAX_INPUT_LENGTH = void 0;
const FormatSheetService_1 = require("../services/FormatSheetService");
const geminiClient_1 = require("../services/geminiClient");
exports.MAX_INPUT_LENGTH = 5000;
const NOT_CONFIGURED_MESSAGE = "O assistente não está configurado neste servidor.";
const formatSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const texto = typeof req.body.texto === "string" ? req.body.texto.trim() : "";
    if (texto === "") {
        return res.status(400).json({
            status: "Fail",
            message: "Cole a lista de ofertas antes de formatar."
        });
    }
    if (texto.length > exports.MAX_INPUT_LENGTH) {
        return res.status(400).json({
            status: "Fail",
            message: `A lista passou de ${exports.MAX_INPUT_LENGTH} caracteres. Envie em partes.`
        });
    }
    if (!(0, geminiClient_1.isGeminiConfigured)()) {
        return res.status(503).json({
            status: "Fail",
            message: NOT_CONFIGURED_MESSAGE
        });
    }
    try {
        const { blocos, avisos } = yield (0, FormatSheetService_1.formatSheetService)(texto);
        return res.status(200).json({
            status: "Success",
            blocos,
            avisos
        });
    }
    catch (e) {
        if (e instanceof geminiClient_1.GeminiNotConfiguredError) {
            return res.status(503).json({ status: "Fail", message: NOT_CONFIGURED_MESSAGE });
        }
        if (e instanceof geminiClient_1.GeminiRateLimitError) {
            return res.status(429).json({ status: "Fail", message: e.message });
        }
        if (e instanceof geminiClient_1.GeminiRequestError) {
            return res.status(502).json({ status: "Fail", message: e.message });
        }
        console.error("Erro ao formatar a lista:", e);
        return res.status(500).json({
            status: "Error",
            message: "Não foi possível formatar a lista. Tente novamente."
        });
    }
});
exports.formatSheet = formatSheet;
