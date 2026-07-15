import { AppError } from "../../exception/AppError.js";
import { parsePDFFile } from "./pdfParser.js";
import { parseTxtFile } from "./txtParser.js";

export function parseFile(extention : string, filepath : string) {

    // console.log(extention);

    switch(extention) {

        case ".pdf": 
            return parsePDFFile(filepath);
        case ".txt":
            return parseTxtFile(filepath);
        default:
            throw new AppError(400, "FILE_TYPE_NOT_SUPPORTED", "Unsupported File Type");
    }

}