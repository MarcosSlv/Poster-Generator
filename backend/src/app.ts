import express from "express";
import { router } from "./routes/index";

import cors from "cors";
import path from "path";

const allowedOrigins = (process.env.CORS_ORIGIN ?? "").split(",").map((origin) => origin.trim()).filter(Boolean);

export const app = express();



app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  maxAge: 86400,
}));

app.use("/pdfs", express.static(path.resolve(__dirname, "../pdfs")));
app.use("/public", express.static(path.resolve(__dirname, "../utils")));

app.use(express.json({ limit: "20mb" }));

app.use("/api", router);
