import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function chunkDocuments(documents : any[]) {

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 100
    });

    const chunks = await splitter.splitDocuments(documents);

    return chunks;
}