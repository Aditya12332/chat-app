import express from "express";
import { suggestReplies, summarize, aiChat } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/suggest", suggestReplies);
router.post("/summarize", summarize);
router.post("/chat", aiChat);

export default router;