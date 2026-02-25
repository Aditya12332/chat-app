import { useState, useRef, useEffect } from "react";
import { useAiStore } from "../store/useAiStore";
import { X, Send, Sparkles, Trash2, Bot } from "lucide-react";

// ── Text formatter ────────────────────────────────────────────────────────────
const InlineFormatted = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={idx}>{part.slice(1, -1)}</em>;
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
};

const FormattedText = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];

  lines.forEach((raw, i) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2">
          <span className="text-primary font-semibold text-xs mt-0.5 shrink-0 w-4">{numMatch[1]}.</span>
          <span className="text-sm leading-relaxed"><InlineFormatted text={numMatch[2]} /></span>
        </div>
      );
      return;
    }

    const bulletMatch = trimmed.match(/^[•\-*]\s+(.+)/);
    if (bulletMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2">
          <span className="text-primary mt-1.5 shrink-0">
            <svg width="5" height="5" viewBox="0 0 5 5" fill="currentColor"><circle cx="2.5" cy="2.5" r="2.5"/></svg>
          </span>
          <span className="text-sm leading-relaxed"><InlineFormatted text={bulletMatch[1]} /></span>
        </div>
      );
      return;
    }

    const isHeading =
      (trimmed.endsWith(":") && trimmed.length < 60 && !trimmed.includes(".")) ||
      /^\*\*[^*]+\*\*:?$/.test(trimmed);

    if (isHeading) {
      const label = trimmed.replace(/^\*\*|\*\*$/g, "").replace(/:$/, "");
      elements.push(
        <p key={i} className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mt-3 first:mt-0">
          {label}
        </p>
      );
      return;
    }

    elements.push(
      <p key={i} className="text-sm leading-relaxed"><InlineFormatted text={trimmed} /></p>
    );
  });

  return <div className="space-y-1.5">{elements}</div>;
};

// ── Component ─────────────────────────────────────────────────────────────────
const AiAssistantPanel = () => {
  const { showAiPanel, closeAiPanel, aiMessages, isAiReplying, sendAiMessage, clearAiMessages } =
    useAiStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isAiReplying]);

  useEffect(() => {
    if (showAiPanel) {
      const t = setTimeout(() => inputRef.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [showAiPanel]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const msg = input.trim();
    if (!msg || isAiReplying) return;
    setInput("");
    await sendAiMessage(msg);
  };

  const starterPrompts = [
    "Help me write a professional reply",
    "Explain the last message simply",
    "Suggest conversation topics",
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {showAiPanel && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={closeAiPanel}
        />
      )}

      {/*
        LAYOUT STRATEGY — fixes the phantom gap bug:

        Mobile (<md):
          • Always fixed/absolute, off-screen when closed via translateX
          • Never participates in document flow → no layout impact

        Desktop (md+):
          • showAiPanel=true  → "md:flex md:w-80 md:border-l"  (flex sibling, takes 320px)
          • showAiPanel=false → "md:hidden"                     (removed from flow entirely, ZERO width)
          
        This is the key: md:hidden completely removes the element from the flex row
        so the chat column gets 100% of the space when panel is closed.
        No translate tricks needed on desktop — just mount/unmount via hidden.
      */}
      <div
        className={`
          flex flex-col bg-base-100 border-base-300
          transition-transform duration-300 ease-in-out

          fixed top-0 right-0 h-full z-30 w-[85vw] max-w-xs
          ${showAiPanel ? "translate-x-0 shadow-2xl border-l" : "translate-x-full"}

          md:static md:h-auto md:z-auto md:translate-x-0 md:shadow-none md:transition-none
          ${showAiPanel ? "md:flex md:w-80 md:border-l" : "md:hidden"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot size={15} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">AI Assistant</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="size-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                <p className="text-[10px] text-base-content/40 leading-none">Groq · compound-beta</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            {aiMessages.length > 0 && (
              <button
                onClick={clearAiMessages}
                className="btn btn-ghost btn-xs btn-circle opacity-40 hover:opacity-100 transition-opacity"
                title="Clear conversation"
              >
                <Trash2 size={13} />
              </button>
            )}
            <button onClick={closeAiPanel} className="btn btn-ghost btn-sm btn-circle">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {aiMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Ask me anything</p>
                <p className="text-xs text-base-content/40 mt-1">I can help with your conversation</p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-1">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                    className="btn btn-xs h-8 rounded-xl border border-base-300
                               hover:border-primary/40 hover:bg-primary/5
                               normal-case font-normal text-xs text-left
                               justify-start px-3 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  {msg.role === "assistant" && (
                    <span className="text-[10px] text-base-content/30 pl-1">Axora AI</span>
                  )}
                  <div
                    className={`
                      rounded-2xl px-3 py-2.5 max-w-[88%]
                      ${msg.role === "user"
                        ? "bg-primary text-primary-content rounded-br-sm text-sm leading-relaxed"
                        : "bg-base-200 text-base-content rounded-bl-sm"
                      }
                    `}
                  >
                    {msg.role === "assistant"
                      ? <FormattedText text={msg.content} />
                      : <p className="text-sm leading-relaxed">{msg.content}</p>
                    }
                  </div>
                </div>
              ))}

              {isAiReplying && (
                <div className="flex items-start">
                  <div className="bg-base-200 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="size-1.5 rounded-full bg-base-content/30 animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-base-300 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 input input-bordered input-sm rounded-xl text-sm min-w-0"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isAiReplying}
            />
            <button
              type="submit"
              className="btn btn-sm btn-primary btn-circle shrink-0"
              disabled={!input.trim() || isAiReplying}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AiAssistantPanel;