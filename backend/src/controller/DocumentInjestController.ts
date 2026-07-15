import type { Request, Response } from "express";
import { AppError } from "../exception/AppError.js";
import { parseFile } from "../service/parsers/index.js";
import path from "node:path";
import { chunkDocuments } from "../service/chunker/chunker.js";
import { doEmbeddings } from "../service/providers/EmbeddingModel.js";
import { randomUUID } from "node:crypto";
import { addDocs } from "../service/QdrantService.js";

async function POSTDocumentInjestController(request : Request, response : Response) {

    try {
        
        const file = request.file;

        if(!file) {
            throw new AppError(500, "INTERNAL_SERVER_ERROR", "File Upload Failed");
        }

        let filepath = file.path;

        const docs = await parseFile(path.extname(filepath), filepath);

        const chunks = await chunkDocuments(docs);

        const embeddings = await doEmbeddings(chunks.map((chunk) => (chunk.pageContent)));

        const points = chunks.map((chunk, index) => {
            return {
                id: randomUUID(),
                vector: embeddings[index]?.embedding,
                payload: {
                    text: chunk.pageContent,
                    ...chunk.metadata
                }
            }
        });

        await addDocs(points);

        return response.status(200).json({
            success: true,
            message: "File Ingested Successfully",
        });

    } catch (error) {
        throw error;
    }
    

}

export { POSTDocumentInjestController };