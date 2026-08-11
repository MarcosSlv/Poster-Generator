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
exports.generateComboPoster = exports.generateSmallPoster = exports.generateBigPoster = exports.validateSheet = exports.REQUIRED_FIELDS = exports.MAX_ROWS = void 0;
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const GeneratePostersService_1 = require("../services/GeneratePostersService");
const createDirectory_1 = require("../utils/createDirectory");
exports.MAX_ROWS = 200;
exports.REQUIRED_FIELDS = {
    default: ["produto", "preco", "medida"],
    combo: ["produto", "medida", "comboQtd"]
};
const POSTER_KINDS = {
    big: { tamanho: "cartaz-grande", requiredFields: exports.REQUIRED_FIELDS.default, label: "grande" },
    small: { tamanho: "cartaz-pequeno", requiredFields: exports.REQUIRED_FIELDS.default, label: "pequeno" },
    combo: { tamanho: "cartaz-combo", requiredFields: exports.REQUIRED_FIELDS.combo, label: "combo" }
};
const isFilled = (value) => (typeof value === "string" || typeof value === "number") && String(value).trim() !== "";
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
        requiredFields.every((field) => isFilled(item[field])));
    if (!rowsAreValid) {
        return { ok: false, message: "Verifique se o conteúdo enviado na planilha está correto" };
    }
    return { ok: true };
};
exports.validateSheet = validateSheet;
const buildPdfPath = () => {
    const pdfDirectory = path_1.default.resolve(__dirname, '../../pdfs');
    (0, createDirectory_1.createDirectory)(pdfDirectory);
    const pdfFileName = `Cartaz_${(0, crypto_1.randomUUID)()}.pdf`;
    return { pdfFileName, pdfFilePath: path_1.default.resolve(pdfDirectory, pdfFileName) };
};
const createPosterHandler = ({ tamanho, requiredFields, label }) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheet = req.body.sheet;
        const validation = (0, exports.validateSheet)(sheet, requiredFields);
        if (!validation.ok) {
            return res.status(400).json({
                status: "Fail",
                message: validation.message
            });
        }
        const { pdfFileName, pdfFilePath } = buildPdfPath();
        yield (0, GeneratePostersService_1.generatePosterService)(sheet, pdfFilePath, tamanho);
        return res.status(200).json({
            status: "Success",
            message: "Cartazes criados com sucesso!",
            download: `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`
        });
    }
    catch (e) {
        console.error(`Erro ao gerar cartaz ${label}:`, e);
        return res.status(500).json({
            status: "Error",
            message: "Não foi possível gerar os cartazes. Tente novamente."
        });
    }
});
exports.generateBigPoster = createPosterHandler(POSTER_KINDS.big);
exports.generateSmallPoster = createPosterHandler(POSTER_KINDS.small);
exports.generateComboPoster = createPosterHandler(POSTER_KINDS.combo);
