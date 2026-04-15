import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";


export const extractTextFromFile = async (filePath: string, filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();

  if (!ext) {
    throw new Error("Unknown file type");
  }

  switch (ext) {

    case "pdf": {
        const dataBuffer = fs.readFileSync(filePath);
        const uint8Array = new Uint8Array(dataBuffer);
  
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
  
        let text = "";
  
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
  
          const pageText = content.items
            .map((item: any) => item.str)
            .join(" ");
  
          text += pageText + "\n";
        }
  
        return text;
      }

    case "docx": {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    }

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
  
};