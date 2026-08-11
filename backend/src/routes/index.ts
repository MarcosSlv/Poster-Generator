import { Router } from "express";
import postersRouter from "./posters.routes";
import assistantRouter from "./assistant.routes";

const router = Router();

router.use("/posters", postersRouter);
router.use("/assistant", assistantRouter);

export { router };
