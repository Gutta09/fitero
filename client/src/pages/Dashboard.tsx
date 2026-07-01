import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../data/store.ts";
import { PROGRAMS } from "../data/programs.ts";

const WATER_TARGET = 8;

function streakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak >= 7) return "On fire! Keep it up";
  return "Building momentum…";
}

function weeklyMessage(done: number, goal: number): string {
  if (done >= goal) return "Goal complete!";
  const rem = goal - done;
  return `${rem} session${rem === 1 ? "" : "s"} to go`;
}

export default function Dashboard() {
  const nav = useNavigate();
  const profile = store.getProfile();
  const logs = store.getWorkoutLogs().slice(0, 5);
  const todayKey = store.todayStr();
  const todayNutrition = store.getNutritionForDate(todayKey);
  const activeProgram = PROGRAMS.find((p) => p.id === profile.activeProgramId);
  const [water, setWater] = useState(() => store.getWaterToday(todayKey));

  function addGlass() {
    const next = Math.min(water + 1, WATER_TARGET + 4);
    store.setWaterToday(todayKey, next);
    setWater(next);
  }

  function removeGlass() {
    const next = Math.max(water - 1, 0);
    store.setWaterToday(todayKey, next);
    setWater(next);
  }

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

  const allLogs = store.getWorkoutLogs();
  const thisWeek = allLogs.filter((l) => {
    const d = new Date(l.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 86400000;
    return diff <= 7;
  });

  // Calculate workout streak (consecutive days ending today/yesterday)
  const streak = (() => {
    const dates = new Set(allLogs.map((l) => l.date.slice(0, 10)));
    let count = 0;
    const cursor = new Date();
    if (!dates.has(cursor.toISOString().slice(0, 10))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (dates.has(cursor.toISOString().slice(0, 10))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  })();

  const weeklyGoal = activeProgram?.daysPerWeek ?? 4;
  const weeklyDone = thisWeek.length;
  const ringPct = Math.min(1, weeklyDone / weeklyGoal);
  const RING_R = 28;
  const RING_CIRC = 2 * Math.PI * RING_R;
  const ringColor = ringPct >= 1 ? "var(--green)" : "var(--gold)";
  const barColor = ringPct >= 1 ? "var(--green)" : "var(--gold)";

  const displayDate = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const waterPct = Math.min(1, water / WATER_TARGET);
  const waterColor = waterPct >= 1 ? "var(--green)" : "#4a9eff";

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{displayDate}</div>
        <h1 style={{ fontSize: 42, fontWeight: 900 }}>
          GM, <span style={{ color: "var(--gold)" }}>{profile.name}</span>
        </h1>
      </div>

      {/* Streak + Weekly Ring + Water row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Streak card */}
        <div className="card" style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 44, lineHeight: 1 }}>🔥</div>
          <div>
            <div style={{ fontSize: 48, fontFamily: "Barlow Condensed", fontWeight: 900, color: "var(--gold)", lineHeight: 1 }}>
              {streak}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
              Day Streak
            </div>
            <div style={{ fontSize: 12, color: "var(--green)", marginTop: 4 }}>
              {streakMessage(streak)}
            </div>
          </div>
        </div>

        {/* Weekly goal ring */}
        <div className="card" style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 20 }}>
          <svg width={80} height={80} viewBox="0 0 80 80">
            <circle cx={40} cy={40} r={RING_R} fill="none" stroke="var(--border)" strokeWidth={6} />
            <circle
              cx={40} cy={40} r={RING_R}
              fill="none"
              stroke={ringColor}
              strokeWidth={6}
              strokeDasharray={RING_CIRC}
              strokeDashoffset={RING_CIRC * (1 - ringPct)}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
            <text x={40} y={44} textAnchor="middle" fill="var(--text)" fontSize={16} fontFamily="Barlow Condensed" fontWeight={800}>
              {weeklyDone}/{weeklyGoal}
            </text>
          </svg>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Weekly Goal</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              {weeklyMessage(weeklyDone, weeklyGoal)}
            </div>
            <div style={{ marginTop: 10, height: 4, background: "var(--border)", borderRadius: 2, width: 120, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${ringPct * 100}%`, background: barColor, borderRadius: 2, transition: "width 0.6s ease" }} />
            </div>
          </div>
        </div>

        {/* Water tracker */}
        <div className="card" style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 44, lineHeight: 1 }}>💧</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 48, fontFamily: "Barlow Condensed", fontWeight: 900, color: waterColor, lineHeight: 1 }}>
              {water}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
              / {WATER_TARGET} glasses
            </div>
            <div style={{ marginTop: 10, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${waterPct * 100}%`, background: waterColor, borderRadius: 2, transition: "width 0.3s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={removeGlass}
                style={{ background: "var(--dark3)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 12px", color: "var(--muted)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>
                −
              </button>
              <button onClick={addGlass}
                style={{ background: waterColor, border: "none", borderRadius: 6, padding: "4px 12px", color: "var(--black)", cursor: "pointer", fontSize: 16, fontWeight: 700, lineHeight: 1, flex: 1 }}>
                + Glass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Sessions this week", value: thisWeek.length, max: profile.activeProgramId ? (activeProgram?.daysPerWeek ?? 0) : null, suffix: "" },
          { label: "Total XP", value: `${profile.xp}`, max: null, suffix: " xp" },
          { label: "Calories today", value: Math.round(todayMacros.calories), max: profile.targetCalories, suffix: "" },
          { label: "Protein today", value: `${Math.round(todayMacros.protein)}g`, max: null, suffix: "" },
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
              No sessions logged yet.{" "}
              <button style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: 14 }} onClick={() => nav("/app/workout")}>
                Start your first →
              </button>
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
