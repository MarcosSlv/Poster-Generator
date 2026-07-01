import pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";

import { posterContent, comboPosterContent } from "../types/posterContent";

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

export const generatePosterService = async (data: posterContent[] | comboPosterContent[], outputFilePath: string, tamanho: string,): Promise<void> => {

  const validRows = data.filter(
    (row) => row.produto != "" && ('preco' in row ? row.preco != "" : true) && row.medida != "");

  let documentDefinitions: TDocumentDefinitions;

  if (tamanho === "cartaz-pequeno") {
    documentDefinitions = generateSmallPoster(validRows as posterContent[]);
  } else if (tamanho === "cartaz-combo") {
    documentDefinitions = generateComboPoster(validRows as comboPosterContent[]);
  } else {
    documentDefinitions = generateBigPoster(validRows as posterContent[]);
  }

  const pdfDocGenerator = pdfMake.createPdf(documentDefinitions);

  return new Promise<void>((resolve, reject) => {
    pdfDocGenerator.getBuffer(async (buffer) => {
      try {
        await fsPromises.writeFile(outputFilePath, new Uint8Array(buffer));
        console.log("PDF criado com sucesso.");
        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};

const formatText = (produto: string) => {
  const formatedText = produto.split(" ").map(palavra => palavra.length > 10 ? palavra.substring(0, 5) + "." : palavra).join(" ").toUpperCase();
  return formatedText;
};

const generateBigPoster = (data: posterContent[]): TDocumentDefinitions => {
  const content = data.map((row, index) => {
    const pageContent: Content = {
      stack: [
        {
          text: formatText(row.produto),
          bold: true,
          fontSize: 50,
          alignment: "center",
          absolutePosition: { x: 20, y: 190 },
        },
        {
          text: "POR:",
          bold: true,
          fontSize: 30,
          alignment: "left",
          absolutePosition: { x: 50, y: 500 },
        },
        {
          text: "R$",
          bold: true,
          fontSize: 30,
          alignment: "left",
          absolutePosition: { x: 17, y: 720 },
        },
        {
          text: row.preco.replace(".", ","),
          bold: true,
          fontSize: 170,
          alignment: "center",
          absolutePosition: { x: 10, y: 520 },
        },
        {
          text: row.medida,
          bold: true,
          fontSize: 30,
          alignment: "right",
          absolutePosition: { x: 0, y: 720 },
        },

      ],
      margin: [0, 0, 0, 20],
    };

    if (row.limite) {
      pageContent.stack.push({
        text: `LIMITADO A ${row.limite} POR CLIENTE`,
        bold: true,
        fontSize: 24,
        alignment: "center",
        absolutePosition: { x: 10, y: 760 }
      });
    }

    if (index < data.length - 1) {
      pageContent.stack.push({ text: "", pageBreak: "after" });
    }
    return pageContent;
  });

  return {
    pageSize: "A4",
    pageMargins: [10, 10, 20, 10],
    content: content,
    defaultStyle: {
      font: "Urbane",
      bold: true
    },
  };
};

const generateSmallPoster = (data: posterContent[]): TDocumentDefinitions => {
  const content: Content[] = [];

  for (let i = 0; i < data.length; i += 2) {
    const row = data[i];
    const nextRow = data[i + 1] ? data[i + 1] : null;

    console.log(nextRow);

    if (nextRow) {
      const pageContent: Content = {
        stack: [
          {
            text: formatText(row.produto),
            fontSize: 37,
            alignment: "center",
            absolutePosition: { x: 280, y: 80 },
          },
          {
            text: "R$",
            fontSize: 20,
            alignment: "left",
            absolutePosition: { x: 280, y: 335 },
          },
          {
            text: row.preco.replace(".", ","),
            bold: true,
            fontSize: 76,
            alignment: "center",
            absolutePosition: { x: 280, y: 276 },
          },
          {
            text: row.medida,
            fontSize: 20,
            alignment: "right",
            absolutePosition: { x: 0, y: 335 },
          },
          ...(row.limite
            ? [
              {
                text: `LIMITADO A ${row.limite} POR CLIENTE`,
                fontSize: 12,
                bold: true,
                alignment: "center",
                absolutePosition: { x: 280, y: 370 },
              } as Content,
            ]
            : []),
          {
            text: formatText(nextRow.produto),
            fontSize: 37,
            alignment: "center",
            absolutePosition: { x: 280, y: 510 },
          },
          {
            text: "R$",
            fontSize: 20,
            alignment: "left",
            absolutePosition: { x: 280, y: 745 },
          },
          {
            text: nextRow.preco.replace(".", ","),
            fontSize: 76,
            alignment: "center",
            absolutePosition: { x: 280, y: 688 },
          },
          {
            text: nextRow.medida,
            fontSize: 20,
            alignment: "right",
            absolutePosition: { x: 0, y: 745 },
          },
          ...(nextRow.limite
            ?
            [
              {
                text: `LIMITADO A ${nextRow.limite} POR CLIENTE`,
                fontSize: 12,
                bold: true,
                alignment: "center",
                absolutePosition: { x: 280, y: 780 },
              } as Content
            ]
            : []),
        ],
        margin: [0, 0, 0, 20],
      };
      if (i + 2 < data.length) {
        pageContent.stack.push({ text: "", pageBreak: "after" });
      }
      content.push(pageContent);
    } else {
      const pageContent: Content = {
        stack: [
          {
            text: formatText(row.produto),
            fontSize: 37,
            alignment: "center",
            absolutePosition: { x: 280, y: 80 },
          },
          {
            text: "R$",
            fontSize: 20,
            alignment: "left",
            absolutePosition: { x: 280, y: 335 },
          },
          {
            text: row.preco.replace(".", ","),
            bold: true,
            fontSize: 76,
            alignment: "center",
            absolutePosition: { x: 280, y: 276 },
          },
          {
            text: row.medida,
            fontSize: 20,
            alignment: "right",
            absolutePosition: { x: 0, y: 335 },
          },
          ...(row.limite
            ? [
              {
                text: `LIMITADO A ${row.limite} POR CLIENTE`,
                fontSize: 12,
                bold: true,
                alignment: "center",
                absolutePosition: { x: 280, y: 370 },
              } as Content,
            ]
            : []),
        ],
        margin: [0, 0, 0, 20],
      };
      if (i + 2 < data.length) {
        pageContent.stack.push({ text: "", pageBreak: "after" });
      }
      content.push(pageContent);
    }
  }

  return {
    pageSize: "A4",
    pageMargins: [10, 10, 28, 10],
    content: content,
    defaultStyle: {
      font: "Urbane",
      bold: true
    },
  };
};

const generateComboPoster = (data: comboPosterContent[]): TDocumentDefinitions => {
  const content = data.map((row, index) => {
    const pageContent: Content = {
      stack: [
        {
          text: "10ZÃO",
          bold: true,
          fontSize: 90,
          alignment: "right",
          absolutePosition: { x: 247, y: 128 },
        },
        {
          text: formatText(row.produto),
          bold: true,
          fontSize: 45,
          alignment: "center",
          absolutePosition: { x: 20, y: 262 }
        },
        {
          text: `${row.comboQtd} UNIDADE${Number(row.comboQtd) > 1 ? 'S' : ''} POR:`,
          bold: true,
          fontSize: 40,
          alignment: "center",
          absolutePosition: { x: 0, y: 515 },
        },
        {
          text: "R$",
          bold: true,
          fontSize: 24,
          alignment: "left",
          absolutePosition: { x: 12, y: 680 },
        },
        {
          text: "10,00",
          bold: true,
          fontSize: 175,
          alignment: "center",
          absolutePosition: { x: -3, y: 525 },
        },
        {
          text: row.medida,
          bold: true,
          fontSize: 24,
          noWrap: true,
          absolutePosition: { x: 534, y: 680 },
        },
        ...(
          row.comboVlr
            ? [
              {
                text: `NESTA OFERTA A UNIDADE SAI POR R$${row.comboVlr.replace(".", ",")}`,
                bold: true,
                fontSize: 18,
                alignment: "center",
                absolutePosition: { x: 0, y: 750 },
              },
            ]
            : []) as Content[],
      ],
      margin: [0, 0, 0, 25],
    };

    if (index < data.length - 1) {
      pageContent.stack.push({ text: "", pageBreak: "after" });
    }

    return pageContent;
  });

  return {
    pageSize: "A4",
    pageMargins: [10, 10, 25, 10],
    content,
    defaultStyle: {
      font: "Urbane",
      bold: true
    },
  };
};
