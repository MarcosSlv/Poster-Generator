import { Router } from "express";
import { formatSheet } from "../controllers/AssistantController";

const assistantRouter = Router();

assistantRouter.post("/format", formatSheet);

export default assistantRouter;
