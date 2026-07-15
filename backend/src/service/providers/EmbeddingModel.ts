import type { CreateEmbeddingsRequest, CreateEmbeddingsResponse } from "@openrouter/sdk/models/operations";
import { openRouter } from "../../config/provider.js";

async function doEmbeddings(texts : string[]) {

    const res = await openRouter.embeddings.generate({
        requestBody: {
            model: process.env.NVIDIA_EMBEDDING_MODEL as string,
            input: texts,
        }
    });

    // console.log(res);

    if(typeof res !== "string") {
        return res.data;
    }

    return [];
}

export { doEmbeddings };