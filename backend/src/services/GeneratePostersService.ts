import pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";

import { posterContent, comboPosterContent } from "../types/posterContent";
import { asPrice, asText, formatText } from "./posterText";
import {
  BIG_POSTER,
  COMBO_POSTER,
  COMBO_PRECO,
  COMBO_SELO,
  PAGE_MARGINS,
  SMALL_POSTER,
  STACK_MARGINS,
  TextSpec
} from "./posterLayout";

const urbaneFontPath = path.join(__dirname, "..", "utils", "fonts", "Urbane-Bold.ttf");
const urbaneFont = fs.readFileSync(urbaneFontPath).toString("base64");

pdfMake.vfs = {
  "Urbane-Bold.ttf": urbaneFont,
};

pdfMake.fonts = {
  Urbane: {
    bold: "Urbane-Bold.ttf",
  },
};

const text = (content: string, spec: TextSpec): Content => ({
  text: content,
  bold: true,
  fontSize: spec.fontSize,
  ...(spec.alignment ? { alignment: spec.alignment } : {}),
  ...(spec.noWrap ? { noWrap: true } : {}),
  absolutePosition: { x: spec.x, y: spec.y }
});

const document = (
  content: Content[],
  pageMargins: [number, number, number, number]
): TDocumentDefinitions => ({
  pageSize: "A4",
  pageMargins,
  content,
  defaultStyle: {
    font: "Urbane",
    bold: true
  }
});

const withPageBreak = (page: Content & { stack: Content[] }, hasNext: boolean) => {
  if (hasNext) {
    page.stack.push({ text: "", pageBreak: "after" });
  }

  return page;
};

const smallPosterBlock = (row: posterContent, spec: typeof SMALL_POSTER.top): Content[] => {
  const block: Content[] = [
    text(formatText(row.produto), spec.produto),
    text("R$", spec.moeda),
    text(asPrice(row.preco), spec.preco),
    text(asText(row.medida), spec.medida)
  ];

  if (row.limite) {
    block.push(text(`LIMITADO A ${row.limite} POR CLIENTE`, spec.limite));
  }

  return block;
};

const generateBigPoster = (data: posterContent[]): TDocumentDefinitions => {
  const content = data.map((row, index) => {
    const page = {
      stack: [
        text(formatText(row.produto), BIG_POSTER.produto),
        text("POR:", BIG_POSTER.por),
        text("R$", BIG_POSTER.moeda),
        text(asPrice(row.preco), BIG_POSTER.preco),
        text(asText(row.medida), BIG_POSTER.medida)
      ],
      margin: STACK_MARGINS.big
    };

    if (row.limite) {
      page.stack.push(text(`LIMITADO A ${row.limite} POR CLIENTE`, BIG_POSTER.limite));
    }

    return withPageBreak(page, index < data.length - 1);
  });

  return document(content, PAGE_MARGINS.big);
};

const generateSmallPoster = (data: posterContent[]): TDocumentDefinitions => {
  const content: Content[] = [];

  for (let i = 0; i < data.length; i += 2) {
    const nextRow = data[i + 1];

    const page = {
      stack: [
        ...smallPosterBlock(data[i], SMALL_POSTER.top),
        ...(nextRow ? smallPosterBlock(nextRow, SMALL_POSTER.bottom) : [])
      ],
      margin: STACK_MARGINS.small
    };

    content.push(withPageBreak(page, i + 2 < data.length));
  }

  return document(content, PAGE_MARGINS.small);
};

const generateComboPoster = (data: comboPosterContent[]): TDocumentDefinitions => {
  const content = data.map((row, index) => {
    const unidades = `${row.comboQtd} UNIDADE${Number(row.comboQtd) > 1 ? 'S' : ''} POR:`;

    const page = {
      stack: [
        text(COMBO_SELO, COMBO_POSTER.selo),
        text(formatText(row.produto), COMBO_POSTER.produto),
        text(unidades, COMBO_POSTER.chamada),
        text("R$", COMBO_POSTER.moeda),
        text(COMBO_PRECO, COMBO_POSTER.preco),
        text(asText(row.medida), COMBO_POSTER.medida)
      ],
      margin: STACK_MARGINS.combo
    };

    if (row.comboVlr) {
      page.stack.push(
        text(`NESTA OFERTA A UNIDADE SAI POR R$${asPrice(row.comboVlr)}`, COMBO_POSTER.unidade)
      );
    }

    return withPageBreak(page, index < data.length - 1);
  });

  return document(content, PAGE_MARGINS.combo);
};

const POSTER_BUILDERS: Record<string, (rows: never[]) => TDocumentDefinitions> = {
  "cartaz-pequeno": generateSmallPoster as (rows: never[]) => TDocumentDefinitions,
  "cartaz-combo": generateComboPoster as (rows: never[]) => TDocumentDefinitions,
  "cartaz-grande": generateBigPoster as (rows: never[]) => TDocumentDefinitions
};

export const generatePosterService = async (
  data: posterContent[] | comboPosterContent[],
  outputFilePath: string,
  tamanho: string
): Promise<void> => {
  const validRows = data.filter(
    (row) => asText(row.produto).trim() !== ""
      && ('preco' in row ? asText(row.preco).trim() !== "" : true)
      && asText(row.medida).trim() !== "");

  const build = POSTER_BUILDERS[tamanho] ?? POSTER_BUILDERS["cartaz-grande"];
  const pdfDocGenerator = pdfMake.createPdf(build(validRows as never[]));

  return new Promise<void>((resolve, reject) => {
    pdfDocGenerator.getBuffer(async (buffer) => {
      try {
        await fsPromises.writeFile(outputFilePath, new Uint8Array(buffer));
        resolve();
      } catch (err) {
        console.error("Erro ao gravar o PDF:", err);
        reject(err);
      }
    });
  });
};
