import { useAiStore } from "../store/useAiStore";
import { X, Sparkles, FileText } from "lucide-react";

// ── Inline formatter (same logic as AiAssistantPanel) ────────────────────────
const InlineFormatted = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={idx} className="font-semibold text-base-content">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={idx}>{part.slice(1, -1)}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
};

const FormattedSummary = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];

  lines.forEach((raw, i) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2.5">
          <span className="text-primary font-bold text-xs mt-0.5 shrink-0 w-4 tabular-nums">
            {numMatch[1]}.
          </span>
          <span className="text-sm text-base-content/80 leading-relaxed">
            <InlineFormatted text={numMatch[2]} />
          </span>
        </div>
      );
      return;
    }

    // Bullet list
    const bulletMatch = trimmed.match(/^[•\-*]\s+(.+)/);
    if (bulletMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2.5">
          <span className="text-primary mt-2 shrink-0">
            <svg width="5" height="5" viewBox="0 0 5 5" fill="currentColor">
              <circle cx="2.5" cy="2.5" r="2.5" />
            </svg>
          </span>
          <span className="text-sm text-base-content/80 leading-relaxed">
            <InlineFormatted text={bulletMatch[1]} />
          </span>
        </div>
      );
      return;
    }

    // Section heading: short line ending with ":" or fully bold
    const isHeading =
      (trimmed.endsWith(":") && trimmed.length < 60 && !trimmed.includes(".")) ||
      /^\*\*[^*]+\*\*:?$/.test(trimmed);

    if (isHeading) {
      const label = trimmed.replace(/^\*\*|\*\*$/g, "").replace(/:$/, "");
      elements.push(
        <div key={i} className="flex items-center gap-2 mt-5 first:mt-0">
          <div className="h-px flex-1 bg-base-300" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 shrink-0">
            {label}
          </p>
          <div className="h-px flex-1 bg-base-300" />
        </div>
      );
      return;
    }

    // Plain paragraph
    elements.push(
      <p key={i} className="text-sm text-base-content/80 leading-relaxed">
        <InlineFormatted text={trimmed} />
      </p>
    );
  });

  return <div className="space-y-2">{elements}</div>;
};

// ── Modal ─────────────────────────────────────────────────────────────────────
const SummarizeModal = () => {
  const { showSummaryModal, summary, isSummarizing, closeSummaryModal } = useAiStore();

  if (!showSummaryModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && closeSummaryModal()}
    >
      <div
        className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg 
                      overflow-hidden border border-base-300 
                      animate-[fadeScaleIn_0.2s_ease-out]"
        style={{
          animation: "fadeScaleIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300 bg-base-200/60">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Conversation Summary</h3>
              <p className="text-[11px] text-base-content/40 mt-0.5">AI-generated overview</p>
            </div>
          </div>
          <button
            onClick={closeSummaryModal}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {isSummarizing ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative size-12">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Sparkles
                  size={14}
                  className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Analyzing conversation...</p>
                <p className="text-xs text-base-content/40 mt-1">This takes a few seconds</p>
              </div>
            </div>
          ) : summary ? (
            <FormattedSummary text={summary} />
          ) : null}
        </div>

        {/* Footer */}
        {!isSummarizing && summary && (
          <div className="px-5 py-3 border-t border-base-300 bg-base-200/30 flex items-center justify-between">
            <p className="text-[11px] text-base-content/30">
              Based on last 30 messages
            </p>
            <button
              onClick={closeSummaryModal}
              className="btn btn-sm btn-primary rounded-xl px-5"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizeModal;