import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useAiStore } from "../store/useAiStore";
import { Image, Send, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, messages } = useChatStore();
  const { authUser } = useAuthStore();
  const { fetchSuggestions, isSuggestionsLoading } = useAiStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSmartReply = () => {
    if (!messages?.length) {
      toast("No messages yet");
      return;
    }

    // ── KEY FIX: find the last message from the OTHER person, not authUser ──
    // Smart replies should suggest how to respond to what the other person said,
    // not what you yourself last said.
    const lastOtherMessage = [...messages]
      .reverse()
      .find((m) => m.senderId !== authUser._id);

    if (!lastOtherMessage?.text) {
      toast("No message from the other person to reply to");
      return;
    }

    // Build context: last 15 messages that have text, preserving order,
    // prefixed with who sent them so the AI understands the conversation flow
    const context = messages
      .slice(-15)
      .filter((m) => m.text)
      .map((m) =>
        m.senderId === authUser._id
          ? `Me: ${m.text}`
          : `Them: ${m.text}`
      );

    fetchSuggestions(lastOtherMessage.text, context);
  };

  return (
    <div className="px-3 py-3 sm:px-4 sm:py-4 w-full shrink-0 border-t border-base-300/50">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                         flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/*
        Input row — all screen sizes:
        [ Sparkles ] [ Image ] [ ── input flex-1 ── ] [ Send ]
        All buttons are shrink-0, input gets all remaining space.
      */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">

        {/* Smart reply */}
        <button
          type="button"
          onClick={handleSmartReply}
          disabled={isSuggestionsLoading}
          className="btn btn-circle btn-ghost btn-sm shrink-0 text-primary hover:bg-primary/10 transition-colors"
          title="Smart reply suggestions"
        >
          {isSuggestionsLoading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Sparkles size={16} />
          )}
        </button>

        {/* Image upload */}
        <button
          type="button"
          className={`btn btn-circle btn-ghost btn-sm shrink-0 transition-colors
            ${imagePreview
              ? "text-emerald-500 hover:bg-emerald-500/10"
              : "text-zinc-400 hover:bg-base-300"
            }`}
          onClick={() => fileInputRef.current?.click()}
          title="Attach image"
        >
          <Image size={16} />
        </button>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Text input */}
        <input
          type="text"
          className="flex-1 min-w-0 input input-bordered rounded-xl input-sm sm:input-md text-sm"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Send */}
        <button
          type="submit"
          className="btn btn-circle btn-sm shrink-0 btn-primary"
          disabled={!text.trim() && !imagePreview}
          title="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;