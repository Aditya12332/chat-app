import { useChatStore } from "../store/useChatStore";
import { useAiStore } from "../store/useAiStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import SmartReplies from "./SmartReplies";
import AiAssistantPanel from "./AiAssistantPanel";
import SummarizeModal from "./SummarizeModal";

import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const { showAiPanel, clearSuggestions, closeAiPanel } = useAiStore();
  const messageEndRef = useRef(null);

  // Stable ref so closeAiPanel never triggers the effect to re-run
  const closeAiPanelRef = useRef(closeAiPanel);
  useEffect(() => {
    closeAiPanelRef.current = closeAiPanel;
  }, [closeAiPanel]);

  useEffect(() => {
    // Close AI panel & suggestions when switching chats — use ref so this
    // effect only depends on selectedUser._id, never on store function refs
    closeAiPanelRef.current();
    clearSuggestions();

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSuggestionSelect = async (suggestion) => {
    clearSuggestions();
    if (!suggestion.trim()) return;
    try {
      await sendMessage({ text: suggestion, image: null });
    } catch (err) {
      console.error("Failed to send suggested reply:", err);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <>
      <SummarizeModal />

      {/*
        Outer wrapper: flex-row, fills remaining space after Sidebar.
        When AI panel is open:
          - On md+ screens: sidebar shrinks (handled in Sidebar), chat area
            compresses, AI panel takes 320px on the right.
          - On mobile: AI panel overlays as a drawer over the chat area.
      */}
      <div className="flex-1 flex overflow-hidden relative min-w-0">

        {/* ── Main chat column ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <ChatHeader />

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Smart reply chips */}
          <SmartReplies onSelect={handleSuggestionSelect} />

          {/* Input */}
          <MessageInput />
        </div>

        {/* ── AI Assistant Panel ────────────────────────────────────── */}
        {/*
          Desktop (md+): renders as a flex sibling — pushes chat area left.
          Mobile: absolute drawer that overlays from the right.
        */}
        <AiAssistantPanel />
      </div>
    </>
  );
};

export default ChatContainer;