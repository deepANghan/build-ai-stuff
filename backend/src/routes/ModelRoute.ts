import { Router } from "express";
import { GetModels } from "../controller/ModelController.js";

export const modelRouter = Router();

modelRouter.get("/", GetModels);