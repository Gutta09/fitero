import React, { useState, useRef, useEffect } from "react";
import { store } from "../data/store.ts";
import { PROGRAMS } from "../data/programs.ts";

type Message = { role: "user" | "assistant"; content: string };

function buildTrainingContext() {
  const profile = store.getProfile();
  const activeProgram = PROGRAMS.find((p) => p.id === profile.activeProgramId);
  return {
    user: {
      name: profile.name,
      goal: profile.goal,
      level: profile.level,
      weightKg: profile.weightKg,
      activeProgramId: profile.activeProgramId,
      activeProgramName: activeProgram?.name ?? null,
      activeWeek: profile.activeWeek,
      targetCalories: profile.targetCalories,
      targetProtein: profile.targetProtein,
      xp: profile.xp,
    },
    recentWorkouts: store.getWorkoutLogs().slice(0, 7).map((log) => ({
      date: log.date,
      focus: log.focus,
      durationMin: Math.round(log.durationSec / 60),
      exercises: log.exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets.filter((s) => s.reps > 0 || s.weight > 0),
      })),
    })),
    todayNutrition: (() => {
      const n = store.getNutritionForDate(store.todayStr());
      if (!n) return null;
      return n.meals.reduce(
        (acc, meal) => {
          meal.foods.forEach((f) => { acc.calories += f.calories; acc.protein += f.protein; });
          return acc;
        },
        { calories: 0, protein: 0 }
      );
    })(),
  };
}

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "What's up. I'm your AI coach — I can see your recent sessions and logged weights. Tell me how training's been going, or ask me to adjust your plan.",
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
        body: JSON.stringify({ message: text, context: buildTrainingContext() }),
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
          Reads your logged sessions and adapts your plan. Powered by Claude.
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
            "How am I doing this week?",
            "My bench is stuck — what should I do?",
            "I missed 3 sessions, adjust my plan",
            "Build me a new program from scratch",
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
