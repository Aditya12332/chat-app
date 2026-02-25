import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

let groq;
if (!apiKey) {
  // Avoid throwing at import time when running in environments
  // where the GROQ API key isn't set (dev/test). Export a stub
  // that will throw a clear error when used.
  console.warn(
    "GROQ_API_KEY is not set. Groq client will throw if used."
  );
  groq = {
    chat: {
      create: async () => {
        throw new Error(
          "GROQ_API_KEY is missing. Set GROQ_API_KEY to use groq.chat.create."
        );
      },
    },
  };
} else {
  groq = new Groq({
    apiKey,
  });
}

export default groq;