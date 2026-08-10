import { Request, Response } from "express";
import { generatePosterService } from "../services/GeneratePostersService";
import { createDirectory } from "../utils/createDirectory";
import { posterContent, comboPosterContent } from "../types/posterContent";
import path from 'path';
import { randomUUID } from 'crypto';

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

type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

const validateSheet = (sheet: unknown, headers: string[]): ValidationResult => {
  if (!Array.isArray(sheet) || sheet.length === 0) {
    return { ok: false, message: "Nenhum item foi enviado para a criação dos cartazes." };
  }

  if (sheet.length > MAX_ROWS) {
    return { ok: false, message: `Limite de ${MAX_ROWS} cartazes por requisição excedido.` };
  }

  const rowsAreValid = sheet.every((item) =>
    item !== null &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    headers.every((header) => {
      const value = (item as Record<string, unknown>)[header];
      return (typeof value === "string" || typeof value === "number") && String(value).trim() !== "";
    })
  );

  if (!rowsAreValid) {
    return { ok: false, message: "Verifique se o conteúdo enviado na planilha está correto" };
  }

  return { ok: true };
};

const buildPdfPath = () => {
  const pdfDirectory = path.resolve(__dirname, '../../pdfs');
  createDirectory(pdfDirectory);

  const pdfFileName = `Cartaz_${randomUUID()}.pdf`;

  return { pdfFileName, pdfFilePath: path.resolve(pdfDirectory, pdfFileName) };
};

export const generateSmallPoster = async (req: Request, res: Response) => {
  try {
    const sheet: posterContent[] = req.body.sheet;
    const tamanho = "cartaz-pequeno";

    const validation = validateSheet(sheet, expectedHeaders.defaultPoster);

    if (!validation.ok) {
      return res.status(400).json({
        status: "Fail",
        message: validation.message
      });
    }

    const { pdfFileName, pdfFilePath } = buildPdfPath();

    await generatePosterService(sheet, pdfFilePath, tamanho);

    const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
    return res.status(200).json({
      status: "Success",
      message: "Cartazes criados com sucesso!",
      download: downloadUrl
    });
  } catch (e) {
    console.error("Erro ao gerar cartaz pequeno:", e);
    return res.status(500).json({
      status: "Error",
      message: "Não foi possível gerar os cartazes. Tente novamente."
    });
  }
};

export const generateBigPoster = async (req: Request, res: Response) => {
  try {
    const sheet: posterContent[] = req.body.sheet;
    const tamanho = "cartaz-grande";

    const validation = validateSheet(sheet, expectedHeaders.defaultPoster);

    if (!validation.ok) {
      return res.status(400).json({
        status: "Fail",
        message: validation.message
      });
    }

    const { pdfFileName, pdfFilePath } = buildPdfPath();

    await generatePosterService(sheet, pdfFilePath, tamanho);

    const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
    return res.status(200).json({
      status: "Success",
      message: "Cartazes criados com sucesso!",
      download: downloadUrl
    });
  } catch (e) {
    console.error("Erro ao gerar cartaz grande:", e);
    return res.status(500).json({
      status: "Error",
      message: "Não foi possível gerar os cartazes. Tente novamente."
    });
  }
};

export const generateComboPoster = async (req: Request, res: Response) => {
  try {
    const sheet: comboPosterContent[] = req.body.sheet;
    const tamanho = "cartaz-combo";

    const validation = validateSheet(sheet, expectedHeaders.comboPoster);

    if (!validation.ok) {
      return res.status(400).json({
        status: "Fail",
        message: validation.message
      });
    }

    const { pdfFileName, pdfFilePath } = buildPdfPath();

    await generatePosterService(sheet, pdfFilePath, tamanho);

    const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
    return res.status(200).json({
      status: "Success",
      message: "Cartazes criados com sucesso!",
      download: downloadUrl
    });

  } catch (e) {
    console.error("Erro ao gerar cartaz combo:", e);
    return res.status(500).json({
      status: "Error",
      message: "Não foi possível gerar os cartazes. Tente novamente."
    });
  }
};
