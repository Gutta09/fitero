import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { store } from "../data/store.ts";
import type { BodyMeasurement, WorkoutLog } from "../data/store.ts";

type StallInfo = { name: string; recentWeight: number; sessions: number };

function collectExerciseHistory(logs: WorkoutLog[]): Record<string, number[]> {
  const history: Record<string, number[]> = {};
  for (const log of logs) {
    for (const ex of log.exercises) {
      const maxW = ex.sets.reduce((m, s) => Math.max(m, s.weight), 0);
      if (maxW > 0) {
        if (!history[ex.name]) history[ex.name] = [];
        if (history[ex.name].length < 5) history[ex.name].push(maxW);
      }
    }
  }
  return history;
}

function computeStalledLifts(logs: WorkoutLog[]): StallInfo[] {
  const history = collectExerciseHistory(logs);
  const result: StallInfo[] = [];
  for (const [name, weights] of Object.entries(history)) {
    if (weights.length < 3) continue;
    if (weights[0] <= Math.max(...weights.slice(1))) {
      result.push({ name, recentWeight: weights[0], sessions: weights.length });
    }
  }
  return result.slice(0, 5);
}

const MEASUREMENT_FIELDS: { key: keyof BodyMeasurement; label: string; unit: string }[] = [
  { key: "weight", label: "Body Weight", unit: "kg" },
  { key: "chest", label: "Chest", unit: "cm" },
  { key: "waist", label: "Waist", unit: "cm" },
  { key: "hips", label: "Hips", unit: "cm" },
  { key: "arms", label: "Arms", unit: "cm" },
  { key: "thighs", label: "Thighs", unit: "cm" },
];

const CHART_TOOLTIP_STYLE = {
  background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 8,
  color: "var(--text)", fontSize: 13,
};

export default function Progress() {
  const logs = store.getWorkoutLogs();
  const [savedMeasurements, setSavedMeasurements] = useState<BodyMeasurement[]>(() =>
    store.getMeasurements().slice(0, 30).reverse()
  );
  const measurements = savedMeasurements;
  const [newMeasure, setNewMeasure] = useState<Partial<BodyMeasurement>>({ date: store.todayStr() });
  const [showForm, setShowForm] = useState(false);
  const [activeMetric, setActiveMetric] = useState<keyof BodyMeasurement>("weight");

  function saveMeasurement() {
    if (!newMeasure.date) return;
    store.addMeasurement(newMeasure as BodyMeasurement);
    setSavedMeasurements(store.getMeasurements().slice(0, 30).reverse());
    setNewMeasure({ date: store.todayStr() });
    setShowForm(false);
  }

  // Weekly session counts
  const weeklyData = (() => {
    const weeks: Record<string, number> = {};
    logs.forEach((l) => {
      const d = new Date(l.date);
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      const key = monday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      weeks[key] = (weeks[key] ?? 0) + 1;
    });
    return Object.entries(weeks).slice(-8).map(([week, sessions]) => ({ week, sessions }));
  })();

  // Per-exercise PR tracking
  const prs: Record<string, number> = {};
  logs.forEach((l) => {
    l.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (!prs[ex.name] || s.weight > prs[ex.name]) prs[ex.name] = s.weight;
      });
    });
  });
  const prList = Object.entries(prs).filter(([, w]) => w > 0).sort((a, b) => b[1] - a[1]);

  // Measurement chart data for selected metric
  const measureChartData = measurements
    .filter((m) => m[activeMetric] != null)
    .map((m) => ({ date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), value: m[activeMetric] }));

  const totalSessions = logs.length;
  const totalXp = store.getProfile().xp;
  const thisWeekSessions = logs.filter((l) => {
    const d = new Date(l.date);
    return (Date.now() - d.getTime()) / 86400000 <= 7;
  }).length;

  const stalledLifts = computeStalledLifts(logs);

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 32 }}>PROGRESS</h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Sessions", value: totalSessions },
          { label: "This Week", value: thisWeekSessions },
          { label: "Total XP", value: `${totalXp}` },
          { label: "Level", value: `${Math.floor(totalXp / 500) + 1}` },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 36, color: "var(--gold)" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {stalledLifts.length > 0 && (
        <div className="card" style={{ padding: "24px", marginBottom: 24, border: "1px solid rgba(248,113,113,0.3)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f87171", marginBottom: 10 }}>
            Stall Detected — {stalledLifts.length} lift{stalledLifts.length === 1 ? "" : "s"} with no progression
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, lineHeight: 1.5 }}>
            No weight increase across the last 3+ sessions. Consider a 10–15% deload, a rep-range shift, or ask your AI coach.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stalledLifts.map((s) => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(248,113,113,0.06)", borderRadius: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</span>
                <span style={{ fontSize: 13, color: "#f87171" }}>{s.recentWeight}kg · {s.sessions} sessions stalled</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Weekly sessions chart */}
        <div className="card" style={{ padding: "24px" }}>
          <div className="section-label">Weekly Sessions</div>
          {weeklyData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "var(--muted)", fontSize: 14 }}>No sessions logged yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="week" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: "rgba(201,168,76,0.08)" }} />
                <Bar dataKey="sessions" fill="var(--gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PRs */}
        <div className="card" style={{ padding: "24px", overflowY: "auto", maxHeight: 280 }}>
          <div className="section-label">Personal Records</div>
          {prList.length === 0 ? (
            <div style={{ fontSize: 14, color: "var(--muted)", paddingTop: 16 }}>Log your weights to track PRs.</div>
          ) : (
            prList.map(([name, w]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                <span style={{ fontWeight: 500 }}>{name}</span>
                <span style={{ color: "var(--gold)", fontWeight: 700 }}>{w} kg</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Body measurements */}
      <div className="card" style={{ padding: "24px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="section-label" style={{ margin: 0 }}>Body Measurements</div>
          <button className="btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Log Today +"}
          </button>
        </div>

        {showForm && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "20px", background: "var(--dark3)", borderRadius: 8, marginBottom: 16 }}>
            {MEASUREMENT_FIELDS.map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                  {f.label} ({f.unit})
                </label>
                <input type="number" placeholder="—"
                  value={(newMeasure[f.key] as number) ?? ""}
                  onChange={(e) => setNewMeasure((m) => ({ ...m, [f.key]: parseFloat(e.target.value) || undefined }))}
                  style={{ width: "100%", background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--text)", fontSize: 15 }}
                />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <button className="btn-primary" onClick={saveMeasurement}>Save Measurements</button>
            </div>
          </div>
        )}

        {/* Metric selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {MEASUREMENT_FIELDS.map((f) => (
            <button key={f.key} onClick={() => setActiveMetric(f.key)}
              style={{
                padding: "7px 14px", borderRadius: 6, border: "1px solid",
                borderColor: activeMetric === f.key ? "var(--gold)" : "var(--border)",
                background: activeMetric === f.key ? "rgba(201,168,76,0.1)" : "transparent",
                color: activeMetric === f.key ? "var(--gold)" : "var(--muted)",
                fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer",
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {measureChartData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={measureChartData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={2} dot={{ fill: "var(--gold)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: 14 }}>
            Log at least 2 measurements to see the chart.
          </div>
        )}
      </div>
    </div>
  );
}
