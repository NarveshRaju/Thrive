import React, { useState } from "react";
import SecondaryButton from "../../components/ui/SecondaryButton";
import PrimaryButton from "../../components/ui/PrimaryButton";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Tell me how you want to change your resume. Example: “Make my summary more focused on React and TypeScript.”",
  },
];

const AiEditChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: "user", text: input.trim() };
    const mockReply = {
      id: Date.now() + 1,
      role: "assistant",
      text: "In the full version, I’ll call the AI API with your resume and this request, then update the document automatically.",
    };

    setMessages((prev) => [...prev, userMsg, mockReply]);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-zinc-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            AI Resume Editor
          </span>
          <p className="mt-2 text-xs text-zinc-400">
            Chat with AI to refine wording, add impact, and match job
            descriptions.
          </p>
        </div>
        <SecondaryButton>Future: Change Log</SecondaryButton>
      </div>

      <div className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-auto max-w-[90%] rounded-xl bg-zinc-800 px-3 py-2 text-xs text-zinc-100"
                : "max-w-[90%] rounded-xl border border-fuchsia-300/40 bg-gradient-to-r from-fuchsia-700/60 to-indigo-700/60 px-3 py-2 text-xs text-fuchsia-50"
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-[#1F242D] bg-[#0E1116] px-4 py-2 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-zinc-500 focus:bg-[#131722]"
          placeholder='Example: "Rewrite my experience bullets to highlight React and TypeScript."'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <PrimaryButton variant="purple" onClick={handleSend}>
          Ask AI
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AiEditChat;
