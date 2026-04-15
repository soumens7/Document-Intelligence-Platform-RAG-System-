import Chunk from "../models/Chunk.js";
import { embedText } from "./embeddingService.js";
import { cosineSimilarity } from "../utils/similarity.js";

export const retrieveChunks = async (
  query: string,
  userId: string,
  documentId: string
) => {
  const queryEmbedding = await embedText(query);

  const chunks = await Chunk.find({ documentId })
  console.log("documentId:", documentId);
  return chunks
    .map(chunk => ({
      ...chunk.toObject(),
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};