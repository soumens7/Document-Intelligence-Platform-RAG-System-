// models/Chat.ts

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    documentId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    sources: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);