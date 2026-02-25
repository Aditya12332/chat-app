import { useAiStore } from "../store/useAiStore";
import { Sparkles, X } from "lucide-react";

const SmartReplies = ({ onSelect }) => {
  const { suggestions, isSuggestionsLoading, showSuggestions, clearSuggestions } = useAiStore();

  if (!showSuggestions) return null;

  return (
    <div className="px-3 sm:px-4 pb-2 border-t border-base-300/50 pt-2">
      <div className="flex items-center gap-2 flex-wrap justify-between mb-2">
        {/* Label */}
        <span className="flex items-center gap-1 text-[10px] text-base-content/40 font-medium uppercase tracking-wide">
          <Sparkles size={10} className="text-primary" />
          AI Suggestions
        </span>

        <button
          onClick={clearSuggestions}
          className="btn btn-ghost btn-circle btn-xs opacity-30 hover:opacity-80 transition-opacity"
          title="Dismiss"
        >
          <X size={11} />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {isSuggestionsLoading ? (
          // Skeleton shimmer chips
          [90, 110, 75].map((w, i) => (
            <div
              key={i}
              className="h-7 rounded-full bg-base-300 animate-pulse"
              style={{ width: w }}
            />
          ))
        ) : (
          <>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(suggestion)}
                className="btn btn-xs h-7 rounded-full border border-primary/25 bg-primary/5
                           hover:bg-primary/15 hover:border-primary/50
                           text-base-content normal-case font-normal text-xs px-3
                           transition-all duration-150 whitespace-nowrap"
                title={suggestion}
              >
                {suggestion}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SmartReplies;