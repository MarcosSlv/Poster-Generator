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
const generateSmallPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheet = req.body.sheet;
        const tamanho = "cartaz-pequeno";
        const sheetHeaders = sheet.every(item => expectedHeaders.defaultPoster.every(header => item.hasOwnProperty(header)));
        console.log(sheet);
        if (!sheetHeaders) {
            return res.status(400).json({
                status: "Fail",
                message: "Verifique se o conteúdo enviado na planilha está correto"
            });
        }
        const pdfDirectory = path_1.default.resolve(__dirname, '../../pdfs');
        (0, createDirectory_1.createDirectory)(pdfDirectory);
        const pdfFileName = `Cartaz_${new Date().
            getDate()}_${new Date().getMonth() + 1}_${Math.random().toFixed(2)}.pdf`;
        const pdfFilePath = path_1.default.resolve(pdfDirectory, pdfFileName);
        yield (0, GeneratePostersService_1.generatePosterService)(sheet, pdfFilePath, tamanho);
        const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
        return res.status(200).json({
            status: "Success",
            message: "Cartazes criados com sucesso!",
            download: downloadUrl
        });
    }
    catch (e) {
        return res.status(500).json({
            status: "Error",
            message: "Something went wrong"
        });
    }
});
exports.generateSmallPoster = generateSmallPoster;
const generateBigPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheet = req.body.sheet;
        const tamanho = "cartaz-grande";
        const sheetHeaders = sheet.every(item => expectedHeaders.defaultPoster.every(header => item.hasOwnProperty(header)));
        console.log(sheet);
        if (!sheetHeaders) {
            return res.status(400).json({
                status: "Fail",
                message: "Verifique se o conteúdo enviado na planilha está correto"
            });
        }
        const pdfDirectory = path_1.default.resolve(__dirname, '../../pdfs');
        (0, createDirectory_1.createDirectory)(pdfDirectory);
        const pdfFileName = `Cartaz_${new Date().
            getDate()}_${new Date().getMonth() + 1}_${Math.random().toFixed(2)}.pdf`;
        const pdfFilePath = path_1.default.resolve(pdfDirectory, pdfFileName);
        yield (0, GeneratePostersService_1.generatePosterService)(sheet, pdfFilePath, tamanho);
        const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
        return res.status(200).json({
            status: "Success",
            message: "Cartazes criados com sucesso!",
            download: downloadUrl
        });
    }
    catch (e) {
        return res.status(500).json({
            status: "Error",
            message: "Something went wrong"
        });
    }
});
exports.generateBigPoster = generateBigPoster;
const generateComboPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheet = req.body.sheet;
        const tamanho = "cartaz-combo";
        const sheetHeaders = sheet.every(item => expectedHeaders.comboPoster.every(header => item.hasOwnProperty(header)));
        console.log(sheet);
        if (!sheetHeaders) {
            return res.status(400).json({
                status: "Fail",
                message: "Verifique se o conteúdo enviado na planilha está correto"
            });
        }
        const pdfDirectory = path_1.default.resolve(__dirname, '../../pdfs');
        (0, createDirectory_1.createDirectory)(pdfDirectory);
        const pdfFileName = `Cartaz_${new Date().
            getDate()}_${new Date().getMonth() + 1}_${Math.random().toFixed(2)}.pdf`;
        const pdfFilePath = path_1.default.resolve(pdfDirectory, pdfFileName);
        yield (0, GeneratePostersService_1.generatePosterService)(sheet, pdfFilePath, tamanho);
        const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
        return res.status(200).json({
            status: "Success",
            message: "Cartazes criados com sucesso!",
            download: downloadUrl
        });
    }
    catch (e) {
        return res.status(500).json({
            status: "Error",
            message: "Something went wrong"
        });
    }
});
exports.generateComboPoster = generateComboPoster;
