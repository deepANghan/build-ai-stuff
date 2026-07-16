import type { Request, Response } from "express";
import { doEmbeddings } from "../service/providers/EmbeddingModel.js";
import { getRelavantDocs } from "../service/QdrantService.js";

export async function GetTestController(request : Request, response : Response) {

    const query = "SOLID principles from my doc";

    const embeddings = await doEmbeddings([query]);

    const docs = await getRelavantDocs(embeddings[0]?.embedding as number[]);

    console.log(docs);

    return response.status(200).send("Success");
}