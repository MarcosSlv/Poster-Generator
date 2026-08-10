"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostersController_1 = require("../controllers/PostersController");
const postersRouter = (0, express_1.Router)();
postersRouter.post("/big", PostersController_1.generateBigPoster);
postersRouter.post("/small", PostersController_1.generateSmallPoster);
postersRouter.post("/combo", PostersController_1.generateComboPoster);
exports.default = postersRouter;
