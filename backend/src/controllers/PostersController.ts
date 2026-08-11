import { Request, Response } from "express";
import path from 'path';
import { randomUUID } from 'crypto';

import { generatePosterService } from "../services/GeneratePostersService";
import { createDirectory } from "../utils/createDirectory";
import { posterContent, comboPosterContent } from "../types/posterContent";
import { REQUIRED_FIELDS, validateSheet } from "../services/sheetValidation";

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
