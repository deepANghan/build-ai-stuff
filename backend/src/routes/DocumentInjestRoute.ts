import { Router } from "express";
import { upload } from "../config/multer.js";
import { POSTDocumentInjestController } from "../controller/DocumentInjestController.js";

export const docsRouter = Router();

docsRouter.post("/upload", upload.single("document"), POSTDocumentInjestController);