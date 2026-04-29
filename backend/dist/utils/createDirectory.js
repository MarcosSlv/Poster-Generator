"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectory = void 0;
const fs_1 = __importDefault(require("fs"));
const createDirectory = (directoryPath) => {
    if (!fs_1.default.existsSync(directoryPath)) {
        fs_1.default.mkdirSync(directoryPath);
    }
};
exports.createDirectory = createDirectory;
