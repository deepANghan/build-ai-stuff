import type { Request, Response } from "express";
import { getModels } from "../service/ModelRegisteryService.js";

async function GetModels(request : Request, response : Response) {

    const models = getModels();

    return response.status(200).json({
        success: true,
        data: {
            models: models
        }
    })

}

export { GetModels };