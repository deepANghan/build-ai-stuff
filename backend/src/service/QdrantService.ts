import { collectionName, qdrantClient } from "../config/Qdrant.js";

async function addDocs(points : any[]) {

    await qdrantClient.upsert(collectionName, {
        wait: true,
        points: points
    });

}

async function getRelavantDocs(embeddings : number[]) {

    const docs = await qdrantClient.search(collectionName, {
        vector: embeddings,
        with_payload: true,
        limit: 5
    });

    return docs;
}   

export { addDocs, getRelavantDocs };