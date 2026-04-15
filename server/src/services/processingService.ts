import fs from "fs";
import Chunk from "../models/Chunk.js";
import Document from "../models/Document.js";
import { embedText } from "./embeddingService.js";
import { extractTextFromFile } from "./fileParser.js";

// 🔹 simple chunking
const chunkText = (text: string, size = 500) => {
  const words = text.split(" ");
  const chunks: string[] = [];

  let current = "";

  for (const word of words) {
    if ((current + word).length > size) {
      chunks.push(current);
      current = "";
    }
    current += word + " ";
  }

  if (current) chunks.push(current);

  return chunks;
};
export const processDocument = async (
  filePath: string,
  documentId: string,
  userId: string,
  filename: string
) => {
  try {
    // Update status
    await Document.findByIdAndUpdate(documentId, { status: "processing" });

// Extract text
const text = await extractTextFromFile(filePath, filename);

    //  Chunk
    const chunks = chunkText(text);

    //  Embed + store
    for (const chunk of chunks) {
      const embedding = await embedText(chunk);

      await Chunk.create({
        text: chunk,
        embedding,
        documentId,
        userId,
      });
    }

    // Update status
    await Document.findByIdAndUpdate(documentId, { status: "ready" });

    console.log("Document processed:", documentId);
  } catch (error) {
    console.error("Processing failed:", error);

    await Document.findByIdAndUpdate(documentId, {
      status: "error",
    });
  }
};