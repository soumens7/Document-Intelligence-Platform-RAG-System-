import type { Request, Response } from "express";
import Document from "../models/Document.js";
import Chat from "../models/Chat.js";
import { processDocument } from "../services/processingService.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

// GET /api/documents
export const getDocuments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;

    const documents = await Document.find({ userId }).sort({
      createdAt: -1,
    });

    res.json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};
// POST upload
export const uploadDocument = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.userId;
    const file = req.file;

    const document = await Document.create({
      filename: file.originalname.slice(0, 100),
      storageName: file.filename,
      userId,
      status: "uploaded",
    });

    // async processing
    processDocument(file.path, document._id.toString(), userId, file.originalname );

    res.json({
      message: "File uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload crash:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};
export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const doc = await Document.findOne({
      _id: req.params.id,
      userId: req.user.userId, 
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    // delete document
    await Document.deleteOne({ _id: doc._id });
    // delete chats
    await Chat.deleteMany({
      documentId: doc._id.toString(), 
    });
    
    res.json({ message: "Document and Chats deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};