"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AssistantController_1 = require("../controllers/AssistantController");
const assistantRouter = (0, express_1.Router)();
assistantRouter.post("/format", AssistantController_1.formatSheet);
exports.default = assistantRouter;
