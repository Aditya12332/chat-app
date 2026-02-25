import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "compound-beta";

// ── Smart Replies ─────────────────────────────────────────────────────────────
export async function getSmartReplies(lastMessage, conversationContext = []) {
  const contextText =
    conversationContext.length > 0
      ? `Recent conversation:\n${conversationContext.join("\n")}\n\n`
      : "";

  const prompt = `${contextText}Last message received: "${lastMessage}"

Generate exactly 3 short, natural reply suggestions for this message.
Rules:
- Each reply must be under 15 words
- Sound like a real human wrote it, not a bot
- Vary the tone: one casual, one direct, one friendly
- Return ONLY a raw JSON array of 3 strings — no markdown, no explanation

Example output: ["Got it, I'll check!", "Sounds good to me.", "Let me get back to you on that."]`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.75,
    max_tokens: 200,
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/```json\n?|```\n?/g, "").trim();
  const suggestions = JSON.parse(cleaned);

  if (!Array.isArray(suggestions) || suggestions.length !== 3) {
    throw new Error("Invalid suggestions format from AI");
  }

  return suggestions;
}

// ── Conversation Summarizer ───────────────────────────────────────────────────
export async function summarizeConversation(messages) {
  // Filter out noise: very short messages (< 2 chars), image-only markers
  const meaningful = messages.filter(
    (m) => m && m.trim().length > 2 && m !== "[image]"
  );

  if (meaningful.length === 0) {
    return "**No discussion points**\n\nThis conversation doesn't contain enough text to summarize yet.";
  }

  const conversation = meaningful.join("\n");

  const prompt = `You are summarizing a chat conversation. Here are the messages:

---
${conversation}
---

Write a structured summary using EXACTLY this format (use these exact section headers):

Key Discussion Points:
• [point 1]
• [point 2]
• [point 3 if applicable]

Action Items:
• [action item 1, or write "None identified" if there are no clear action items]

Guidelines:
- Be concise and factual
- Only include what was actually discussed
- If the conversation is trivial (greetings only), say so briefly under Key Discussion Points
- Do NOT include meta-commentary about the conversation quality
- Do NOT start with phrases like "Here's a summary of..."
- Use plain bullet points with • symbol`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 500,
  });

  return response.choices[0].message.content.trim();
}

// ── AI Assistant ──────────────────────────────────────────────────────────────
export async function chatWithAssistant(message, conversationContext = []) {
  const messages = [
    {
      role: "system",
      content: `You are a helpful AI assistant inside a chat application called Axora.
Be concise, clear, and genuinely helpful.
Format rules:
- Use **bold** for important terms or headings
- Use bullet points (•) for lists
- Use numbered lists for steps
- Keep responses focused — don't pad with unnecessary text
- Plain, friendly tone`,
    },
  ];

  // Interleave context as alternating user/assistant turns
  conversationContext.forEach((msg, index) => {
    messages.push({
      role: index % 2 === 0 ? "user" : "assistant",
      content: msg,
    });
  });

  messages.push({ role: "user", content: message });

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.65,
    max_tokens: 600,
  });

  return response.choices[0].message.content.trim();
}