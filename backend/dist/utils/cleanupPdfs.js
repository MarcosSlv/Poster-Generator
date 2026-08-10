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
exports.startPdfCleanup = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const PDF_DIRECTORY = path_1.default.resolve(__dirname, "../../pdfs");
const MAX_AGE_MS = 60 * 60 * 1000;
const INTERVAL_MS = 15 * 60 * 1000;
const removeExpiredPdfs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield fs_1.promises.readdir(PDF_DIRECTORY);
        const now = Date.now();
        for (const file of files) {
            if (!file.endsWith(".pdf")) {
                continue;
            }
            const filePath = path_1.default.join(PDF_DIRECTORY, file);
            try {
                const stats = yield fs_1.promises.stat(filePath);
                if (now - stats.mtimeMs > MAX_AGE_MS) {
                    yield fs_1.promises.unlink(filePath);
                }
            }
            catch (err) {
                console.error(`Não foi possível remover o PDF ${file}:`, err);
            }
        }
    }
    catch (err) {
        if (err.code !== "ENOENT") {
            console.error("Erro ao limpar a pasta de PDFs:", err);
        }
    }
});
const startPdfCleanup = () => {
    void removeExpiredPdfs();
    const timer = setInterval(() => {
        void removeExpiredPdfs();
    }, INTERVAL_MS);
    timer.unref();
};
exports.startPdfCleanup = startPdfCleanup;
