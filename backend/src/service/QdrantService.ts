import { collectionName, qdrantClient } from "../config/Qdrant.js";

async function addDocs(points : any[]) {

    await qdrantClient.upsert(collectionName, {
        wait: true,
        points: points
    });

}

export { addDocs };