import React, { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "What's up. I'm your AI coach — tell me your goal, how training's been going, or ask me anything about your program. I'll adapt your plan if you need it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? data.error ?? "Something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Can't reach the server. Is it running?" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", maxWidth: 700 }}>
      {/* Header */}
      <div style={{ padding: "28px 32px 0" }}>
        <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 4 }}>AI COACH</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
          Adapts your plan based on your progress. Powered by Claude.
        </p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: "85%",
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            background: m.role === "user" ? "var(--gold)" : "var(--dark2)",
            color: m.role === "user" ? "var(--black)" : "var(--text)",
            padding: "12px 16px",
            borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap",
          }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", color: "var(--muted)", fontSize: 13, fontStyle: "italic", padding: "4px 0" }}>
            Coach is thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div style={{ padding: "0 32px 12px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            "Create me a 4-day muscle-building plan",
            "I missed 3 sessions this week, adjust my plan",
            "What should I eat to bulk?",
            "My bench is stuck at 100kg — what's next?",
          ].map((p) => (
            <button key={p}
              onClick={() => { setInput(p); }}
              style={{
                padding: "8px 14px", borderRadius: 20, border: "1px solid var(--border)",
                background: "transparent", color: "var(--muted)", fontSize: 13, cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 32px 28px", display: "flex", gap: 12 }}>
        <textarea
          rows={1}
          placeholder="Message your coach…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          style={{
            flex: 1, background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 10,
            color: "var(--text)", padding: "12px 16px", fontSize: 14, resize: "none",
            outline: "none", lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
          }}
        />
        <button className="btn-primary" style={{ padding: "0 22px", opacity: loading ? 0.5 : 1 }} onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
