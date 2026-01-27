import { Router } from "express";
import { generateBigPoster, generateSmallPoster, generateComboPoster } from "../controllers/PostersController";
import upload from "../middlewares/multerConfigMiddleware";
import { Request, Response } from "express";


const postersRouter = Router();

postersRouter.post("/big", upload.single("file"), generateBigPoster);
postersRouter.post("/small", upload.single("file"), generateSmallPoster);
postersRouter.post("/combo", upload.single("file"), generateComboPoster);

export default postersRouter;