import {
  getSmartReplies,
  summarizeConversation,
  chatWithAssistant,
} from "../services/ai.service.js";

export async function suggestReplies(req, res) {
  try {
    const { lastMessage, conversationContext = [] } = req.body;

    if (!lastMessage) {
      return res.status(400).json({ error: "lastMessage is required" });
    }

    const suggestions = await getSmartReplies(lastMessage, conversationContext);
    res.json({ suggestions });
  } catch (err) {
    console.error("Smart reply error:", err.message);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
}

export async function summarize(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const summary = await summarizeConversation(messages);
    res.json({ summary });
  } catch (err) {
    console.error("Summarize error:", err.message);
    res.status(500).json({ error: "Failed to summarize conversation" });
  }
}

export async function aiChat(req, res) {
  try {
    const { message, conversationContext = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const reply = await chatWithAssistant(message, conversationContext);
    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
}