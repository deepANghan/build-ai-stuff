import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function parsePDFFile(filePath : string) {

    const loader = new PDFLoader(filePath);

    return loader.load();
}   

export { parsePDFFile };