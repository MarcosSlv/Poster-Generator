"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("./routes/index");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const allowedOrigins = ((_a = process.env.CORS_ORIGIN) !== null && _a !== void 0 ? _a : "").split(",").map((origin) => origin.trim()).filter(Boolean);
if (allowedOrigins.length === 0) {
    console.warn("CORS_ORIGIN não configurado: todas as origens serão aceitas.");
}
class CorsError extends Error {
    constructor(origin) {
        super(`Origem não permitida pelo CORS: ${origin}`);
        this.name = "CorsError";
    }
}
exports.app = (0, express_1.default)();
exports.app.set("trust proxy", 1);
exports.app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new CorsError(origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 86400,
}));
exports.app.use("/pdfs", express_1.default.static(path_1.default.resolve(__dirname, "../pdfs")));
exports.app.use("/public", express_1.default.static(path_1.default.resolve(__dirname, "../utils")));
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use("/api", (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        status: "Fail",
        message: "Muitas requisições em pouco tempo. Aguarde um instante e tente novamente."
    }
}), index_1.router);
exports.app.use((err, _req, res, _next) => {
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
