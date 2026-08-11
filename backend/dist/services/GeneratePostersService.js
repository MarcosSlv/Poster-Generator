"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.generatePosterService = void 0;
const pdfmake_1 = __importDefault(require("pdfmake/build/pdfmake"));
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const posterText_1 = require("./posterText");
const posterLayout_1 = require("./posterLayout");
const urbaneFontPath = path_1.default.join(__dirname, "..", "utils", "fonts", "Urbane-Bold.ttf");
const urbaneFont = fs.readFileSync(urbaneFontPath).toString("base64");
pdfmake_1.default.vfs = {
    "Urbane-Bold.ttf": urbaneFont,
};
pdfmake_1.default.fonts = {
    Urbane: {
        bold: "Urbane-Bold.ttf",
    },
};
const text = (content, spec) => (Object.assign(Object.assign(Object.assign({ text: content, bold: true, fontSize: spec.fontSize }, (spec.alignment ? { alignment: spec.alignment } : {})), (spec.noWrap ? { noWrap: true } : {})), { absolutePosition: { x: spec.x, y: spec.y } }));
const document = (content, pageMargins) => ({
    pageSize: "A4",
    pageMargins,
    content,
    defaultStyle: {
        font: "Urbane",
        bold: true
    }
});
const withPageBreak = (page, hasNext) => {
    if (hasNext) {
        page.stack.push({ text: "", pageBreak: "after" });
    }
    return page;
};
const smallPosterBlock = (row, spec) => {
    const block = [
        text((0, posterText_1.formatText)(row.produto), spec.produto),
        text("R$", spec.moeda),
        text((0, posterText_1.asPrice)(row.preco), spec.preco),
        text((0, posterText_1.asText)(row.medida), spec.medida)
    ];
    if (row.limite) {
        block.push(text(`LIMITADO A ${row.limite} POR CLIENTE`, spec.limite));
    }
    return block;
};
const generateBigPoster = (data) => {
    const content = data.map((row, index) => {
        const page = {
            stack: [
                text((0, posterText_1.formatText)(row.produto), posterLayout_1.BIG_POSTER.produto),
                text("POR:", posterLayout_1.BIG_POSTER.por),
                text("R$", posterLayout_1.BIG_POSTER.moeda),
                text((0, posterText_1.asPrice)(row.preco), posterLayout_1.BIG_POSTER.preco),
                text((0, posterText_1.asText)(row.medida), posterLayout_1.BIG_POSTER.medida)
            ],
            margin: posterLayout_1.STACK_MARGINS.big
        };
        if (row.limite) {
            page.stack.push(text(`LIMITADO A ${row.limite} POR CLIENTE`, posterLayout_1.BIG_POSTER.limite));
        }
        return withPageBreak(page, index < data.length - 1);
    });
    return document(content, posterLayout_1.PAGE_MARGINS.big);
};
const generateSmallPoster = (data) => {
    const content = [];
    for (let i = 0; i < data.length; i += 2) {
        const nextRow = data[i + 1];
        const page = {
            stack: [
                ...smallPosterBlock(data[i], posterLayout_1.SMALL_POSTER.top),
                ...(nextRow ? smallPosterBlock(nextRow, posterLayout_1.SMALL_POSTER.bottom) : [])
            ],
            margin: posterLayout_1.STACK_MARGINS.small
        };
        content.push(withPageBreak(page, i + 2 < data.length));
    }
    return document(content, posterLayout_1.PAGE_MARGINS.small);
};
const generateComboPoster = (data) => {
    const content = data.map((row, index) => {
        const unidades = `${row.comboQtd} UNIDADE${Number(row.comboQtd) > 1 ? 'S' : ''} POR:`;
        const page = {
            stack: [
                text(posterLayout_1.COMBO_SELO, posterLayout_1.COMBO_POSTER.selo),
                text((0, posterText_1.formatText)(row.produto), posterLayout_1.COMBO_POSTER.produto),
                text(unidades, posterLayout_1.COMBO_POSTER.chamada),
                text("R$", posterLayout_1.COMBO_POSTER.moeda),
                text(posterLayout_1.COMBO_PRECO, posterLayout_1.COMBO_POSTER.preco),
                text((0, posterText_1.asText)(row.medida), posterLayout_1.COMBO_POSTER.medida)
            ],
            margin: posterLayout_1.STACK_MARGINS.combo
        };
        if (row.comboVlr) {
            page.stack.push(text(`NESTA OFERTA A UNIDADE SAI POR R$${(0, posterText_1.asPrice)(row.comboVlr)}`, posterLayout_1.COMBO_POSTER.unidade));
        }
        return withPageBreak(page, index < data.length - 1);
    });
    return document(content, posterLayout_1.PAGE_MARGINS.combo);
};
const POSTER_BUILDERS = {
    "cartaz-pequeno": generateSmallPoster,
    "cartaz-combo": generateComboPoster,
    "cartaz-grande": generateBigPoster
};
const generatePosterService = (data, outputFilePath, tamanho) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validRows = data.filter((row) => (0, posterText_1.asText)(row.produto).trim() !== ""
        && ('preco' in row ? (0, posterText_1.asText)(row.preco).trim() !== "" : true)
        && (0, posterText_1.asText)(row.medida).trim() !== "");
    const build = (_a = POSTER_BUILDERS[tamanho]) !== null && _a !== void 0 ? _a : POSTER_BUILDERS["cartaz-grande"];
    const pdfDocGenerator = pdfmake_1.default.createPdf(build(validRows));
    return new Promise((resolve, reject) => {
        pdfDocGenerator.getBuffer((buffer) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield fs_1.promises.writeFile(outputFilePath, new Uint8Array(buffer));
                resolve();
            }
            catch (err) {
                console.error("Erro ao gravar o PDF:", err);
                reject(err);
            }
        }));
    });
});
exports.generatePosterService = generatePosterService;
