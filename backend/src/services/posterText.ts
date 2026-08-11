const MAX_WORD_LENGTH = 10;
const ABBREVIATED_LENGTH = 5;

export const asText = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

export const asPrice = (value: unknown): string => asText(value).replace(".", ",");

export const formatText = (produto: unknown): string =>
  asText(produto)
    .split(" ")
    .map((palavra) => (palavra.length > MAX_WORD_LENGTH ? palavra.substring(0, ABBREVIATED_LENGTH) + "." : palavra))
    .join(" ")
    .toUpperCase();
