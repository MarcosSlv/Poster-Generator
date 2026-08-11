import { Request, Response } from "express";
import path from 'path';
import { randomUUID } from 'crypto';

import { generatePosterService } from "../services/GeneratePostersService";
import { createDirectory } from "../utils/createDirectory";
import { posterContent, comboPosterContent } from "../types/posterContent";

export const MAX_ROWS = 200;

export const REQUIRED_FIELDS = {
  default: ["produto", "preco", "medida"],
  combo: ["produto", "medida", "comboQtd"]
};

type PosterKind = {
  tamanho: string;
  requiredFields: string[];
  label: string;
};

const POSTER_KINDS: Record<"big" | "small" | "combo", PosterKind> = {
  big: { tamanho: "cartaz-grande", requiredFields: REQUIRED_FIELDS.default, label: "grande" },
  small: { tamanho: "cartaz-pequeno", requiredFields: REQUIRED_FIELDS.default, label: "pequeno" },
  combo: { tamanho: "cartaz-combo", requiredFields: REQUIRED_FIELDS.combo, label: "combo" }
};

type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

const isFilled = (value: unknown) =>
  (typeof value === "string" || typeof value === "number") && String(value).trim() !== "";

export const validateSheet = (sheet: unknown, requiredFields: string[]): ValidationResult => {
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
    requiredFields.every((field) => isFilled((item as Record<string, unknown>)[field]))
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

const createPosterHandler = ({ tamanho, requiredFields, label }: PosterKind) =>
  async (req: Request, res: Response) => {
    try {
      const sheet: posterContent[] | comboPosterContent[] = req.body.sheet;

      const validation = validateSheet(sheet, requiredFields);

      if (!validation.ok) {
        return res.status(400).json({
          status: "Fail",
          message: validation.message
        });
      }

      const { pdfFileName, pdfFilePath } = buildPdfPath();

      await generatePosterService(sheet, pdfFilePath, tamanho);

      return res.status(200).json({
        status: "Success",
        message: "Cartazes criados com sucesso!",
        download: `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`
      });
    } catch (e) {
      console.error(`Erro ao gerar cartaz ${label}:`, e);

      return res.status(500).json({
        status: "Error",
        message: "Não foi possível gerar os cartazes. Tente novamente."
      });
    }
  };

export const generateBigPoster = createPosterHandler(POSTER_KINDS.big);
export const generateSmallPoster = createPosterHandler(POSTER_KINDS.small);
export const generateComboPoster = createPosterHandler(POSTER_KINDS.combo);
