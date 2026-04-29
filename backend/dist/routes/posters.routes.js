"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostersController_1 = require("../controllers/PostersController");
const multerConfigMiddleware_1 = __importDefault(require("../middlewares/multerConfigMiddleware"));
const postersRouter = (0, express_1.Router)();
postersRouter.post("/big", multerConfigMiddleware_1.default.single("file"), PostersController_1.generateBigPoster);
postersRouter.post("/small", multerConfigMiddleware_1.default.single("file"), PostersController_1.generateSmallPoster);
postersRouter.post("/combo", multerConfigMiddleware_1.default.single("file"), PostersController_1.generateComboPoster);
exports.default = postersRouter;
