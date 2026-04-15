"use client";

import { useState, useEffect } from "react";
import { askQuestion, getChatHistory } from "../lib/api";

interface ChatBoxProps {
  documentId: string;
}

export default function ChatBox({ documentId }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "AI"; text: string; sources?: string[];
    query?: string; }[]>([]);

  const [loading, setLoading] = useState(false);

  // ✅ LOAD HISTORY
  useEffect(() => {
    if (!documentId) return;

    const fetchHistory = async () => {
      try {
        const data = await getChatHistory(documentId);

        const formatted = data.chats.flatMap((chat: any) => [
            { role: "user", text: chat.question },
            {
              role: "AI",
              text: chat.answer,
              sources: chat.sources || [],
              query: chat.question,
            },
          ]);

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    fetchHistory();
  }, [documentId]);

  const handleAsk = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try{
    const res = await askQuestion(input, documentId);

    setMessages((prev) => [
      ...prev,
      {
        role: "AI",
        text: res.answer,
        sources: (res.sources || []).map((s: any) =>
            typeof s === "string" ? s : s.text
          ),
          query: input,
      },
    ]);
    
}catch (err) {
    console.error(err);
  }
    setLoading(false);
  };
  const highlight = (text: string, query: string) => {
    if (!query) return text;
  
    const words = query
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 3).slice(0, 3);
  
    let result = text;
  
    words.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      result = result.replace(regex, "<mark>$1</mark>");
    });
  
    return result;
  };
  const getBestSentence = (text: string, query: string) => {
    const sentences = text.split(/[.?!]/);
  
    const queryWords = query.toLowerCase().split(" ");
  
    let bestSentence = sentences[0] || text;
    let maxScore = 0;
  
    for (const sentence of sentences) {
      let score = 0;
  
      queryWords.forEach((word) => {
        if (sentence.toLowerCase().includes(word)) {
          score++;
        }
      });
  
      if (score > maxScore) {
        maxScore = score;
        bestSentence = sentence;
      }
    }
  
    return bestSentence.trim().slice(0, 200);
  };
  
  return (
    <div className="p-4">
      <div className="h-[400px] overflow-y-auto border p-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className="mb-3">
            <b>{m.role}:</b> {m.text}

            {/* Sources */}
            {m.sources && m.sources.length > 0 && (
  <div className="mt-2 text-xs text-gray-500">
    <p className="font-semibold mb-1">
      Sources (highlighted by query):
    </p>

    {m.sources.map((s, idx: number) => {
      const best = getBestSentence(s, m.query || "");

      return (
        <div
          key={idx}
          dangerouslySetInnerHTML={{
            __html: "🔹 " + highlight(best, m.query || ""),
          }}
        />
      );
    })}
  </div>
)}
          </div>
        ))}

        {loading && <p>AI is thinking...</p>}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={handleAsk}
        className="mt-2 bg-black text-white px-4 py-2"
      >
        Ask
      </button>
    </div>
  );
}