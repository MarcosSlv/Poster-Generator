export const MAX_ROWS = 200;

export const REQUIRED_FIELDS = {
  default: ["produto", "preco", "medida"],
  combo: ["produto", "medida", "comboQtd"]
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export const isFilled = (value: unknown) =>
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
