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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComboPoster = exports.generateBigPoster = exports.generateSmallPoster = void 0;
const GeneratePostersService_1 = require("../services/GeneratePostersService");
const createDirectory_1 = require("../utils/createDirectory");
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const expectedHeaders = {
    defaultPoster: [
        "produto",
        "preco",
        "medida"
    ],
    comboPoster: [
        "produto",
        "medida",
        "comboQtd"
    ]
};
const MAX_ROWS = 200;
const validateSheet = (sheet, headers) => {
    if (!Array.isArray(sheet) || sheet.length === 0) {
        return { ok: false, message: "Nenhum item foi enviado para a criação dos cartazes." };
    }
    if (sheet.length > MAX_ROWS) {
        return { ok: false, message: `Limite de ${MAX_ROWS} cartazes por requisição excedido.` };
    }
    const rowsAreValid = sheet.every((item) => item !== null &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        headers.every((header) => {
            const value = item[header];
            return (typeof value === "string" || typeof value === "number") && String(value).trim() !== "";
        }));
    if (!rowsAreValid) {
        return { ok: false, message: "Verifique se o conteúdo enviado na planilha está correto" };
    }
    return { ok: true };
};
const buildPdfPath = () => {
    const pdfDirectory = path_1.default.resolve(__dirname, '../../pdfs');
    (0, createDirectory_1.createDirectory)(pdfDirectory);
    const pdfFileName = `Cartaz_${(0, crypto_1.randomUUID)()}.pdf`;
    return { pdfFileName, pdfFilePath: path_1.default.resolve(pdfDirectory, pdfFileName) };
};
const generateSmallPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheet = req.body.sheet;
        const tamanho = "cartaz-pequeno";
        const validation = validateSheet(sheet, expectedHeaders.defaultPoster);
        if (!validation.ok) {
            return res.status(400).json({
                status: "Fail",
                message: validation.message
            });
        }
        const { pdfFileName, pdfFilePath } = buildPdfPath();
        yield (0, GeneratePostersService_1.generatePosterService)(sheet, pdfFilePath, tamanho);
        const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
        return res.status(200).json({
            status: "Success",
            message: "Cartazes criados com sucesso!",
            download: downloadUrl
        });
    }
    catch (e) {
        console.error("Erro ao gerar cartaz pequeno:", e);
        return res.status(500).json({
            status: "Error",
            message: "Não foi possível gerar os cartazes. Tente novamente."
        });
    }
});
exports.generateSmallPoster = generateSmallPoster;
const generateBigPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheet = req.body.sheet;
        const tamanho = "cartaz-grande";
        const validation = validateSheet(sheet, expectedHeaders.defaultPoster);
        if (!validation.ok) {
            return res.status(400).json({
                status: "Fail",
                message: validation.message
            });
        }
        const { pdfFileName, pdfFilePath } = buildPdfPath();
        yield (0, GeneratePostersService_1.generatePosterService)(sheet, pdfFilePath, tamanho);
        const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
        return res.status(200).json({
            status: "Success",
            message: "Cartazes criados com sucesso!",
            download: downloadUrl
        });
    }
    catch (e) {
        console.error("Erro ao gerar cartaz grande:", e);
        return res.status(500).json({
            status: "Error",
            message: "Não foi possível gerar os cartazes. Tente novamente."
        });
    }
});
exports.generateBigPoster = generateBigPoster;
const generateComboPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheet = req.body.sheet;
        const tamanho = "cartaz-combo";
        const validation = validateSheet(sheet, expectedHeaders.comboPoster);
        if (!validation.ok) {
            return res.status(400).json({
                status: "Fail",
                message: validation.message
            });
        }
        const { pdfFileName, pdfFilePath } = buildPdfPath();
        yield (0, GeneratePostersService_1.generatePosterService)(sheet, pdfFilePath, tamanho);
        const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
        return res.status(200).json({
            status: "Success",
            message: "Cartazes criados com sucesso!",
            download: downloadUrl
        });
    }
    catch (e) {
        console.error("Erro ao gerar cartaz combo:", e);
        return res.status(500).json({
            status: "Error",
            message: "Não foi possível gerar os cartazes. Tente novamente."
        });
    }
});
exports.generateComboPoster = generateComboPoster;
