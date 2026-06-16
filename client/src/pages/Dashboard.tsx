import React from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../data/store.ts";
import { PROGRAMS } from "../data/programs.ts";

export default function Dashboard() {
  const nav = useNavigate();
  const profile = store.getProfile();
  const logs = store.getWorkoutLogs().slice(0, 5);
  const todayNutrition = store.getNutritionForDate(store.todayStr());
  const activeProgram = PROGRAMS.find((p) => p.id === profile.activeProgramId);

  const todayMacros = todayNutrition?.meals.reduce(
    (acc, meal) => {
      meal.foods.forEach((f) => {
        acc.calories += f.calories;
        acc.protein += f.protein;
        acc.carbs += f.carbs;
        acc.fat += f.fat;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const thisWeek = store.getWorkoutLogs().filter((l) => {
    const d = new Date(l.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 86400000;
    return diff <= 7;
  });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{today}</div>
        <h1 style={{ fontSize: 42, fontWeight: 900 }}>
          GM, <span style={{ color: "var(--gold)" }}>{profile.name}</span>
        </h1>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Sessions this week", value: thisWeek.length, max: profile.activeProgramId ? (activeProgram?.daysPerWeek ?? 0) : null },
          { label: "Total XP", value: `${profile.xp}`, suffix: " xp" },
          { label: "Calories today", value: Math.round(todayMacros.calories), max: profile.targetCalories },
          { label: "Protein today", value: `${Math.round(todayMacros.protein)}g`, max: null },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 28, fontFamily: "Barlow Condensed", fontWeight: 800, color: "var(--gold)" }}>
              {s.value}{s.suffix}
              {s.max != null && <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 400 }}> / {s.max}</span>}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Active program */}
        <div className="card" style={{ padding: "24px" }}>
          <div className="section-label">Active Program</div>
          {activeProgram ? (
            <>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{activeProgram.name}</h2>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>{activeProgram.subtitle} · Week {profile.activeWeek} of {activeProgram.weeks}</p>
              <div style={{ height: 6, background: "var(--border)", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${((profile.activeWeek - 1) / activeProgram.weeks) * 100}%`, background: "var(--gold)", borderRadius: 3 }} />
              </div>
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => nav("/app/workout")}>
                Start Today's Session →
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p style={{ color: "var(--muted)", marginBottom: 20 }}>No program selected.</p>
              <button className="btn-ghost" onClick={() => nav("/app/programs")}>Browse Programs</button>
            </div>
          )}
        </div>

        {/* Today's nutrition */}
        <div className="card" style={{ padding: "24px" }}>
          <div className="section-label">Today's Nutrition</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 36, fontFamily: "Barlow Condensed", fontWeight: 900, color: "var(--gold)" }}>{Math.round(todayMacros.calories)}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                of {profile.targetCalories} kcal
              </div>
            </div>
            <button className="btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }} onClick={() => nav("/app/nutrition")}>
              Log Food +
            </button>
          </div>
          {[
            { label: "Protein", val: todayMacros.protein, target: profile.targetProtein, color: "#4a9eff" },
            { label: "Carbs", val: todayMacros.carbs, target: profile.targetCarbs, color: "var(--gold)" },
            { label: "Fat", val: todayMacros.fat, target: profile.targetFat, color: "var(--green)" },
          ].map((m) => (
            <div key={m.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                <span>{m.label}</span>
                <span>{Math.round(m.val)}g / {m.target}g</span>
              </div>
              <div style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (m.val / m.target) * 100)}%`, background: m.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent sessions */}
        <div className="card" style={{ padding: "24px", gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="section-label" style={{ margin: 0 }}>Recent Sessions</div>
            <button style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 13 }} onClick={() => nav("/app/progress")}>
              View all →
            </button>
          </div>
          {logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "var(--muted)", fontSize: 14 }}>
              No sessions logged yet. <button style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: 14 }} onClick={() => nav("/app/workout")}>Start your first →</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {logs.map((l) => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--dark2)", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{l.focus}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                      {new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {l.exercises.length} exercises
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: 14 }}>+{l.xp} XP</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {Math.floor(l.durationSec / 60)}m
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
