"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("./routes/index");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: "*"
}));
exports.app.use("/pdfs", express_1.default.static(path_1.default.resolve(__dirname, "../pdfs")));
exports.app.use("/public", express_1.default.static(path_1.default.resolve(__dirname, "../utils")));
exports.app.use(express_1.default.json({ limit: "20mb" }));
exports.app.use("/api", index_1.router);
