import { promises as fsPromises } from "fs";
import path from "path";

const PDF_DIRECTORY = path.resolve(__dirname, "../../pdfs");
const MAX_AGE_MS = 60 * 60 * 1000;
const INTERVAL_MS = 15 * 60 * 1000;

const removeExpiredPdfs = async () => {
  try {
    const files = await fsPromises.readdir(PDF_DIRECTORY);
    const now = Date.now();

    for (const file of files) {
      if (!file.endsWith(".pdf")) {
        continue;
      }

      const filePath = path.join(PDF_DIRECTORY, file);

      try {
        const stats = await fsPromises.stat(filePath);

        if (now - stats.mtimeMs > MAX_AGE_MS) {
          await fsPromises.unlink(filePath);
        }
      } catch (err) {
        console.error(`Não foi possível remover o PDF ${file}:`, err);
      }
    }
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Erro ao limpar a pasta de PDFs:", err);
    }
  }
};

export const startPdfCleanup = () => {
  void removeExpiredPdfs();

  const timer = setInterval(() => {
    void removeExpiredPdfs();
  }, INTERVAL_MS);

  timer.unref();
};
