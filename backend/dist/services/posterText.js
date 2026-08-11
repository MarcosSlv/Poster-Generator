"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatText = exports.asPrice = exports.asText = void 0;
const MAX_WORD_LENGTH = 10;
const ABBREVIATED_LENGTH = 5;
const asText = (value) => value === null || value === undefined ? "" : String(value);
exports.asText = asText;
const asPrice = (value) => (0, exports.asText)(value).replace(".", ",");
exports.asPrice = asPrice;
const formatText = (produto) => (0, exports.asText)(produto)
    .split(" ")
    .map((palavra) => (palavra.length > MAX_WORD_LENGTH ? palavra.substring(0, ABBREVIATED_LENGTH) + "." : palavra))
    .join(" ")
    .toUpperCase();
exports.formatText = formatText;
