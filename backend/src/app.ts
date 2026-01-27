import express from "express";
import { router } from "./routes/index";

import cors from "cors";
import path from "path";

export const app = express();

app.use(cors({
  origin: "*"
}));

app.use("/pdfs", express.static(path.resolve(__dirname, "../pdfs")));
app.use("/public", express.static(path.resolve(__dirname, "../utils")));

app.use(express.json({ limit: "20mb" }));

app.use("/api", router);
