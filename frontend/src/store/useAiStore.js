    import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAiStore = create((set, get) => ({
  // Smart Replies
  suggestions: [],
  isSuggestionsLoading: false,
  showSuggestions: false,

  // Summarize
  summary: null,
  isSummarizing: false,
  showSummaryModal: false,

  // AI Assistant
  showAiPanel: false,
  aiMessages: [], // { role: "user" | "assistant", content: string }
  isAiReplying: false,

  // --- Smart Replies ---
  fetchSuggestions: async (lastMessage, conversationContext = []) => {
    if (!lastMessage) return;
    set({ isSuggestionsLoading: true, showSuggestions: true, suggestions: [] });
    try {
      const res = await axiosInstance.post("/ai/suggest", {
        lastMessage,
        conversationContext,
      });
      set({ suggestions: res.data.suggestions });
    } catch {
      toast.error("Couldn't fetch suggestions");
      set({ showSuggestions: false });
    } finally {
      set({ isSuggestionsLoading: false });
    }
  },

  clearSuggestions: () => set({ suggestions: [], showSuggestions: false }),

  // --- Summarize ---
  fetchSummary: async (messages) => {
    if (!messages?.length) return;
    set({ isSummarizing: true, showSummaryModal: true, summary: null });
    try {
      const res = await axiosInstance.post("/ai/summarize", { messages });
      set({ summary: res.data.summary });
    } catch {
      toast.error("Couldn't summarize conversation");
      set({ showSummaryModal: false });
    } finally {
      set({ isSummarizing: false });
    }
  },

  closeSummaryModal: () => set({ showSummaryModal: false, summary: null }),

  // --- AI Assistant ---
  toggleAiPanel: () => set((s) => ({ showAiPanel: !s.showAiPanel })),
  closeAiPanel: () => set({ showAiPanel: false }),

  sendAiMessage: async (message) => {
    const { aiMessages } = get();
    const updatedMessages = [...aiMessages, { role: "user", content: message }];
    set({ aiMessages: updatedMessages, isAiReplying: true });

    try {
      const context = aiMessages.map((m) => m.content);
      const res = await axiosInstance.post("/ai/chat", {
        message,
        conversationContext: context,
      });
      set({
        aiMessages: [
          ...updatedMessages,
          { role: "assistant", content: res.data.reply },
        ],
      });
    } catch {
      toast.error("AI assistant failed to respond");
      set({ aiMessages: updatedMessages });
    } finally {
      set({ isAiReplying: false });
    }
  },

  clearAiMessages: () => set({ aiMessages: [] }),
}));