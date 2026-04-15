import express from "express";
import { askQuestion, getChatHistory  } from "../controllers/queryController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, askQuestion);
router.get("/history", authMiddleware, getChatHistory);

export default router;