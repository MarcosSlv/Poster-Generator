import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes/index";

import cors from "cors";
import path from "path";
import rateLimit from "express-rate-limit";

const normalizeOrigin = (origin: string) => origin.trim().toLowerCase().replace(/\/+$/, "");

const allowedOrigins = (process.env.CORS_ORIGIN ?? "").split(",").map(normalizeOrigin).filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn("CORS_ORIGIN não configurado: todas as origens serão aceitas.");
}

class CorsError extends Error {
  constructor(origin: string) {
    super(`Origem não permitida pelo CORS: ${origin}`);
    this.name = "CorsError";
  }
}

export const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      return callback(null, true);
    }

    return callback(new CorsError(origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  maxAge: 86400,
}));

app.use("/pdfs", express.static(path.resolve(__dirname, "../pdfs")));
app.use("/public", express.static(path.resolve(__dirname, "../utils")));

app.use(express.json({ limit: "1mb" }));

app.use("/api/assistant", rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "Fail",
    message: "Muitos pedidos ao assistente em pouco tempo. Aguarde um instante e tente novamente."
  }
}));

app.use("/api", rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "Fail",
    message: "Muitas requisições em pouco tempo. Aguarde um instante e tente novamente."
  }
}), router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CorsError) {
    return res.status(403).json({
      status: "Fail",
      message: "Origem não autorizada."
    });
  }

  console.error("Erro não tratado:", err);

  return res.status(500).json({
    status: "Error",
    message: "Não foi possível processar a requisição."
  });
});
