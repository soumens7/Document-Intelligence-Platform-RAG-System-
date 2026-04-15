import express from "express";
import multer from "multer";
import { getDocuments, uploadDocument, deleteDocument } from "../controllers/documentController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

// multer setup
const upload = multer({ dest: "uploads/" });
// GET all documents
router.get("/", authMiddleware, getDocuments);
router.post("/upload", authMiddleware, upload.single("file"),uploadDocument);
router.delete("/:id", authMiddleware, deleteDocument);
export default router;