import { Router } from "express";
import postersRouter from "./posters.routes";

const router = Router();

router.use("/posters", postersRouter);

export { router };
