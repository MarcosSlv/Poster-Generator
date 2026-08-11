import { Request, Response } from "express";

import { formatSheetService } from "../services/FormatSheetService";
import {
  GeminiNotConfiguredError,
  GeminiRateLimitError,
  GeminiRequestError,
  isGeminiConfigured
} from "../services/geminiClient";

export const MAX_INPUT_LENGTH = 5000;

const NOT_CONFIGURED_MESSAGE = "O assistente não está configurado neste servidor.";

export const formatSheet = async (req: Request, res: Response) => {
  const texto = typeof req.body.texto === "string" ? req.body.texto.trim() : "";

  if (texto === "") {
    return res.status(400).json({
      status: "Fail",
      message: "Cole a lista de ofertas antes de formatar."
    });
  }

  if (texto.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({
      status: "Fail",
      message: `A lista passou de ${MAX_INPUT_LENGTH} caracteres. Envie em partes.`
    });
  }

  if (!isGeminiConfigured()) {
    return res.status(503).json({
      status: "Fail",
      message: NOT_CONFIGURED_MESSAGE
    });
  }

  try {
    const { blocos, avisos } = await formatSheetService(texto);

    return res.status(200).json({
      status: "Success",
      blocos,
      avisos
    });
  } catch (e) {
    if (e instanceof GeminiNotConfiguredError) {
      return res.status(503).json({ status: "Fail", message: NOT_CONFIGURED_MESSAGE });
    }

    if (e instanceof GeminiRateLimitError) {
      return res.status(429).json({ status: "Fail", message: e.message });
    }

    if (e instanceof GeminiRequestError) {
      return res.status(502).json({ status: "Fail", message: e.message });
    }

    console.error("Erro ao formatar a lista:", e);

    return res.status(500).json({
      status: "Error",
      message: "Não foi possível formatar a lista. Tente novamente."
    });
  }
};
