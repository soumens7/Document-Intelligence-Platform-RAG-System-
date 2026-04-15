import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { retrieveChunks } from "../services/retrievelService.js";
import { generateAnswer } from "../services/aiService.js";
import Chat from "../models/Chat.js";

export const askQuestion = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { question, documentId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!question || !documentId) {
      return res.status(400).json({ message: "Missing question or documentId" });
    }

    const userId = req.user.userId;

    const chunks = await retrieveChunks(question, userId, documentId);

    const topChunks = chunks.slice(0, 3);
    
    if (topChunks.length === 0) {
      const fallback = "I don't have enough information.";

      await Chat.create({
        userId,
        documentId,
        question,
        answer: fallback,
        sources: [],
      });

      return res.json({ answer: fallback });
    }
    const context = topChunks.map(c => c.text).join("\n\n");

    let answer = "";

try {
  answer = await generateAnswer(context, question);
} catch (err) {
  console.error("AI failed:", err);

  answer = "I couldn't generate a full answer right now, but here’s the most relevant information from your document.";
}

    // SAVE CHAT
    await Chat.create({
      userId,
      documentId,
      question,
      answer,
      sources: topChunks
  .map(c => c.text)
  .filter((text): text is string => Boolean(text))
    });

    res.json({
      answer,
      sources: topChunks.map(c => c.text),
    });
  } catch (err) {
    console.error("askQuestion error:", err);
    res.status(500).json({ message: "Failed to get answer" });
  }
};

export const getChatHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { documentId } = req.query as { documentId?: string };

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!documentId) {
      return res.status(400).json({ message: "Document ID is required" });
    }
    
    const chats = await Chat.find({
      userId: req.user.userId,
      documentId: documentId as string,
    }).sort({ createdAt: 1 });

    res.json({ chats });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};