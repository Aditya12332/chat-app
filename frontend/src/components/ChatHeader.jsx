import { X, FileText, Bot } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useAiStore } from "../store/useAiStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, messages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { fetchSummary, toggleAiPanel, showAiPanel, isSummarizing } = useAiStore();

  const handleSummarize = () => {
    if (!messages?.length) return;
    // Pass last 30 messages as plain strings
    const msgStrings = messages
      .slice(-30)
      .map((m) => (m.text ? m.text : "[image]"));
    fetchSummary(msgStrings);
  };

  return (
    <div className="p-2.5 border-b border-base-300 shrink-0">
      <div className="flex items-center justify-between">
        {/* Left: Avatar + user info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right: AI actions + close */}
        <div className="flex items-center gap-1">
          {/* Summarize button */}
          <button
            onClick={handleSummarize}
            disabled={isSummarizing || !messages?.length}
            className="btn btn-ghost btn-sm gap-1.5 text-xs hidden sm:flex"
            title="Summarize conversation"
          >
            <FileText size={15} className="text-primary" />
            <span className="hidden md:inline">Summarize</span>
          </button>

          {/* AI Assistant toggle */}
          <button
            onClick={toggleAiPanel}
            className={`btn btn-sm gap-1.5 text-xs hidden sm:flex transition-all
              ${showAiPanel
                ? "btn-primary"
                : "btn-ghost"
              }`}
            title="AI Assistant"
          >
            <Bot size={15} />
            <span className="hidden md:inline">AI</span>
          </button>

          {/* Mobile: icon-only summarize */}
          <button
            onClick={handleSummarize}
            disabled={isSummarizing || !messages?.length}
            className="btn btn-ghost btn-sm btn-circle sm:hidden"
            title="Summarize"
          >
            <FileText size={16} className="text-primary" />
          </button>

          {/* Mobile: icon-only AI */}
          <button
            onClick={toggleAiPanel}
            className={`btn btn-sm btn-circle sm:hidden transition-all
              ${showAiPanel ? "btn-primary" : "btn-ghost"}`}
            title="AI Assistant"
          >
            <Bot size={16} />
          </button>

          {/* Close conversation */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-sm btn-circle ml-1"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;