import mongoose from "mongoose";


const chunkSchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
  documentId: String,
  userId: String,
});

export default mongoose.model("Chunk", chunkSchema);