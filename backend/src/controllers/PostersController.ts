import { Request, Response } from "express";
import { generatePosterService } from "../services/GeneratePostersService";
import { createDirectory } from "../utils/createDirectory";
import { posterContent, comboPosterContent } from "../types/posterContent";
import path from 'path';

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

export const generateSmallPoster = async (req: Request, res: Response) => {
  try {
    const sheet: posterContent[] = req.body.sheet;
    const tamanho = "cartaz-pequeno";

    const sheetHeaders = sheet.every(item =>
      expectedHeaders.defaultPoster.every(header => item.hasOwnProperty(header))
    );

    console.log(sheet);
    if (!sheetHeaders) {
      return res.status(400).json({
        status: "Fail",
        message: "Verifique se o conteúdo enviado na planilha está correto"
      });
    }

    const pdfDirectory = path.resolve(__dirname, '../../pdfs');
    createDirectory(pdfDirectory);

    const pdfFileName = `Cartaz_${new Date().
      getDate()}_${new Date().getMonth() + 1}_${Math.random().toFixed(2)}.pdf`;
    const pdfFilePath = path.resolve(pdfDirectory, pdfFileName);

    await generatePosterService(sheet, pdfFilePath, tamanho);

    const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
    return res.status(200).json({
      status: "Success",
      message: "Cartazes criados com sucesso!",
      download: downloadUrl
    });
  } catch (e) {
    return res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
};

export const generateBigPoster = async (req: Request, res: Response) => {
  try {
    const sheet: posterContent[] = req.body.sheet;
    const tamanho = "cartaz-grande";

    const sheetHeaders = sheet.every(item =>
      expectedHeaders.defaultPoster.every(header => item.hasOwnProperty(header))
    );

    console.log(sheet);
    if (!sheetHeaders) {
      return res.status(400).json({
        status: "Fail",
        message: "Verifique se o conteúdo enviado na planilha está correto"
      });
    }

    const pdfDirectory = path.resolve(__dirname, '../../pdfs');
    createDirectory(pdfDirectory);

    const pdfFileName = `Cartaz_${new Date().
      getDate()}_${new Date().getMonth() + 1}_${Math.random().toFixed(2)}.pdf`;
    const pdfFilePath = path.resolve(pdfDirectory, pdfFileName);

    await generatePosterService(sheet, pdfFilePath, tamanho);

    const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
    return res.status(200).json({
      status: "Success",
      message: "Cartazes criados com sucesso!",
      download: downloadUrl
    });
  } catch (e) {
    return res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
};

export const generateComboPoster = async (req: Request, res: Response) => {
  try {
    const sheet: comboPosterContent[] = req.body.sheet;
    const tamanho = "cartaz-combo";

    const sheetHeaders = sheet.every(item =>
      expectedHeaders.comboPoster.every(header => item.hasOwnProperty(header))
    );

    console.log(sheet);
    if (!sheetHeaders) {
      return res.status(400).json({
        status: "Fail",
        message: "Verifique se o conteúdo enviado na planilha está correto"
      });
    }
    const pdfDirectory = path.resolve(__dirname, '../../pdfs');
    createDirectory(pdfDirectory);

    const pdfFileName = `Cartaz_${new Date().
      getDate()}_${new Date().getMonth() + 1}_${Math.random().toFixed(2)}.pdf`;
    const pdfFilePath = path.resolve(pdfDirectory, pdfFileName);
    await generatePosterService(sheet, pdfFilePath, tamanho);

    const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${pdfFileName}`;
    return res.status(200).json({
      status: "Success",
      message: "Cartazes criados com sucesso!",
      download: downloadUrl
    });

  } catch (e) {
    return res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
};
