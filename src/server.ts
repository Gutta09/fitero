import "dotenv/config";
import express from "express";
import cors from "cors";
import { runAgent, type Message } from "./agent/loop.js";
import { planQueries, logQueries } from "./db/index.js";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory session history (one user, one session)
let conversationHistory: Message[] = [];

app.post("/api/chat", async (req, res) => {
  const { message, context } = req.body as { message?: string; context?: object };
  if (!message?.trim()) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  try {
    const { reply, history } = await runAgent(message, conversationHistory, context);
    conversationHistory = history;
    res.json({ reply });
  } catch (err) {
    console.error("Agent error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete("/api/chat", (_req, res) => {
  conversationHistory = [];
  res.json({ cleared: true });
});

app.get("/api/plan", (_req, res) => {
  const plan = planQueries.getActive.get();
  if (!plan) {
    res.json({ plan: null });
    return;
  }
  res.json({
    plan: {
      id: plan.id,
      goal: plan.goal,
      level: plan.level,
      daysPerWeek: plan.days_per_week,
      schedule: JSON.parse(plan.schedule),
      notes: plan.notes,
      createdAt: plan.created_at,
    },
  });
});

app.get("/api/progress", (_req, res) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 28);
  const logs = logQueries.getSince.all(cutoff.toISOString().slice(0, 10));
  res.json({
    logs: logs.map((l) => ({
      id: l.id,
      date: l.date,
      focus: l.focus,
      exercises: JSON.parse(l.exercises),
      sessionNotes: l.session_notes,
    })),
  });
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Fitero API running on http://localhost:${PORT}`);
});
