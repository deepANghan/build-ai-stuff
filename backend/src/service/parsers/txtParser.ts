import { TextLoader } from "@langchain/classic/document_loaders/fs/text"

async function parseTxtFile(filepath : string) {

    const loader = new TextLoader(filepath);

    return loader.load();
}

export { parseTxtFile };