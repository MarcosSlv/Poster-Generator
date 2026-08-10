import { Router } from "express";
import { generateBigPoster, generateSmallPoster, generateComboPoster } from "../controllers/PostersController";

const postersRouter = Router();

postersRouter.post("/big", generateBigPoster);
postersRouter.post("/small", generateSmallPoster);
postersRouter.post("/combo", generateComboPoster);

export default postersRouter;
