import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "compound-beta";

export async function getSmartReplies(lastMessage, conversationContext = []) {
  const contextText =
    conversationContext.length > 0
      ? `Conversation so far:\n${conversationContext.join("\n")}\n\n`
      : "";

  const prompt = `${contextText}Last message: "${lastMessage}"

Generate exactly 3 short, natural reply suggestions for the above message. Each must be under 15 words. Return only a JSON array of 3 strings, nothing else. Example: ["Sure!", "That sounds great!", "Let me think about it."]`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  const suggestions = JSON.parse(cleaned);

  if (!Array.isArray(suggestions) || suggestions.length !== 3) {
    throw new Error("Invalid suggestions format from AI");
  }

  return suggestions;
}

export async function summarizeConversation(messages) {
  const conversation = messages.join("\n");

  const prompt = `Summarize the following chat conversation. Structure the output as:

- Key discussion points (bullet points)
- Action items (if any)

Keep it concise and readable.

Conversation:
${conversation}`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 400,
  });

  return response.choices[0].message.content.trim();
}

export async function chatWithAssistant(message, conversationContext = []) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful assistant in a chat application. Respond clearly and helpfully. Use plain text only, no markdown.",
    },
  ];

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
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content.trim();
}