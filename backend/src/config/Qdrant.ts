import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrantClient = new QdrantClient({
    url: "http://localhost:6333"
});

export const collectionName = "test_rag_collection";

async function createCollectionIfNotExist() {

    if((await qdrantClient.collectionExists(collectionName)).exists) {
        return ;
    }

    await qdrantClient.createCollection(collectionName, {
        vectors: {
            size: 2048,
            distance: "Cosine"
        }
    });
}

export { createCollectionIfNotExist };