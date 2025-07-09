import React, { useState } from "react";

export default function AI() {
  const [messages, setMessages] = useState([
    { text: "Hey! I’m Pixora AI 🤖 — Ask me anything.", sender: "ai" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Simulated AI reply (replace this with real backend later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "I'm still learning! Full power soon. 💡", sender: "ai" },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <div className="p-4 text-xl font-bold border-b border-zinc-700">
        Pixora AI Assistant 🤖
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] p-3 rounded-xl ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-right"
                : "mr-auto bg-zinc-800 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex p-3 border-t border-zinc-700 bg-zinc-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="flex-1 p-2 rounded-l-lg bg-zinc-700 text-white outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-600 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
