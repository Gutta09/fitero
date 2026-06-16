import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../data/store.ts";
import { PROGRAMS } from "../data/programs.ts";
import type { Exercise } from "../data/programs.ts";
import { useTimer } from "../hooks/useTimer.ts";

type SetEntry = { reps: string; weight: string; done: boolean };
type ExerciseState = { exercise: Exercise; sets: SetEntry[] };

function buildInitialState(exercises: Exercise[]): ExerciseState[] {
  return exercises.map((ex) => ({
    exercise: ex,
    sets: Array.from({ length: ex.sets }, () => ({ reps: "", weight: "", done: false })),
  }));
}

export default function Workout() {
  const nav = useNavigate();
  const profile = store.getProfile();
  const program = PROGRAMS.find((p) => p.id === profile.activeProgramId);
  const timer = useTimer();
  const [started, setStarted] = useState(false);
  const [dayIndex, setDayIndex] = useState(0);
  const [state, setState] = useState<ExerciseState[]>([]);
  const [restTimer, setRestTimer] = useState<{ active: boolean; remaining: number }>({ active: false, remaining: 0 });
  const [finished, setFinished] = useState(false);

  const week = program?.schedule[0];
  const day = week?.days[dayIndex];

  // Rest countdown
  useEffect(() => {
    if (!restTimer.active) return;
    if (restTimer.remaining <= 0) { setRestTimer({ active: false, remaining: 0 }); return; }
    const t = setTimeout(() => setRestTimer((r) => ({ ...r, remaining: r.remaining - 1 })), 1000);
    return () => clearTimeout(t);
  }, [restTimer]);

  function startWorkout() {
    if (!day) return;
    setState(buildInitialState(day.exercises));
    timer.start();
    setStarted(true);
  }

  function updateSet(exIdx: number, setIdx: number, field: keyof SetEntry, value: string | boolean) {
    setState((prev) => {
      const next = prev.map((e, i) =>
        i === exIdx
          ? { ...e, sets: e.sets.map((s, j) => j === setIdx ? { ...s, [field]: value } : s) }
          : e
      );
      return next;
    });
  }

  function completeSet(exIdx: number, setIdx: number, restSec: number) {
    updateSet(exIdx, setIdx, "done", true);
    setRestTimer({ active: true, remaining: restSec });
  }

  function finishWorkout() {
    timer.stop();
    const xp = state.reduce((sum, ex) =>
      sum + ex.sets.filter((s) => s.done).length * 10, 0
    );
    store.addWorkoutLog({
      id: `${Date.now()}`,
      programId: profile.activeProgramId ?? "",
      date: store.todayStr(),
      focus: day?.focus ?? "",
      exercises: state.map((ex) => ({
        name: ex.exercise.name,
        sets: ex.sets.filter((s) => s.done).map((s) => ({
          reps: parseInt(s.reps) || 0,
          weight: parseFloat(s.weight) || 0,
        })),
      })),
      durationSec: timer.elapsed,
      xp,
    });
    setFinished(true);
  }

  const completedSets = state.reduce((sum, ex) => sum + ex.sets.filter((s) => s.done).length, 0);
  const totalSets = state.reduce((sum, ex) => sum + ex.sets.length, 0);

  if (finished) {
    const xp = state.reduce((s, ex) => s + ex.sets.filter((set) => set.done).length * 10, 0);
    return (
      <div style={{ padding: "60px 40px", textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🏆</div>
        <h1 style={{ fontSize: 56, fontWeight: 900, marginBottom: 8 }}>SESSION<br /><span style={{ color: "var(--gold)" }}>COMPLETE</span></h1>
        <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 16 }}>
          {day?.focus} · {timer.fmt(timer.elapsed)} · {completedSets} sets
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 40 }}>
          <div className="card" style={{ padding: "20px 28px" }}>
            <div style={{ fontSize: 32, fontFamily: "Barlow Condensed", fontWeight: 900, color: "var(--gold)" }}>+{xp}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>XP Earned</div>
          </div>
          <div className="card" style={{ padding: "20px 28px" }}>
            <div style={{ fontSize: 32, fontFamily: "Barlow Condensed", fontWeight: 900 }}>{timer.fmt(timer.elapsed)}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Duration</div>
          </div>
        </div>
        <button className="btn-primary" style={{ width: "100%" }} onClick={() => nav("/app")}>
          Back to Dashboard →
        </button>
      </div>
    );
  }

  if (!program) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>No Active Program</h2>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>Select a program to start training.</p>
        <button className="btn-primary" onClick={() => nav("/app/programs")}>Browse Programs →</button>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 640 }}>
        <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 8 }}>TODAY'S<br /><span style={{ color: "var(--gold)" }}>WORKOUT</span></h1>
        <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 16 }}>{program.name} · Week {profile.activeWeek}</p>

        {/* Day selector */}
        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          {week?.days.map((d, i) => (
            <button key={i}
              onClick={() => setDayIndex(i)}
              style={{
                padding: "10px 18px", borderRadius: 8, border: "1px solid",
                borderColor: i === dayIndex ? "var(--gold)" : "var(--border)",
                background: i === dayIndex ? "rgba(201,168,76,0.12)" : "transparent",
                color: i === dayIndex ? "var(--gold)" : "var(--muted)",
                fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 14,
                textTransform: "uppercase", cursor: "pointer",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {day && (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ padding: "14px 20px", background: "var(--dark2)", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 20 }}>{day.focus}</span>
                <span style={{ color: "var(--muted)", marginLeft: 12, fontSize: 13 }}>{day.exercises.length} exercises</span>
              </div>
              {day.exercises.map((ex, i) => (
                <div key={i} style={{ padding: "10px 20px", borderBottom: i < day.exercises.length - 1 ? "1px solid var(--border)" : "none", fontSize: 14, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 500 }}>{ex.name}</span>
                  <span style={{ color: "var(--muted)" }}>{ex.sets}×{ex.reps} · {ex.rest}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ width: "100%", fontSize: 20 }} onClick={startWorkout}>
              Start Session →
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", maxWidth: 700 }}>
      {/* Sticky header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, position: "sticky", top: 0, background: "var(--black)", padding: "12px 0", zIndex: 10 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900 }}>{day?.focus}</h2>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{completedSets}/{totalSets} sets done</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 32, color: timer.elapsed > 0 ? "var(--gold)" : "var(--muted)" }}>
            {timer.fmt(timer.elapsed)}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Elapsed</div>
        </div>
      </div>

      {/* Rest timer overlay */}
      {restTimer.active && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "var(--dark2)", border: "1px solid var(--gold)", borderRadius: 14, padding: "16px 24px", textAlign: "center", zIndex: 50 }}>
          <div style={{ fontSize: 11, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Rest</div>
          <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 40, color: "var(--text)" }}>
            {Math.floor(restTimer.remaining / 60)}:{String(restTimer.remaining % 60).padStart(2, "0")}
          </div>
          <button style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12, marginTop: 8 }} onClick={() => setRestTimer({ active: false, remaining: 0 })}>
            Skip rest
          </button>
        </div>
      )}

      {/* Exercises */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {state.map((exState, exIdx) => (
          <div key={exIdx} className="card">
            <div style={{ padding: "14px 20px", background: exState.exercise.fst7 ? "rgba(201,168,76,0.1)" : "var(--dark2)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{exState.exercise.name}</span>
                  {exState.exercise.fst7 && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "var(--gold)", color: "var(--black)", letterSpacing: "0.06em" }}>FST-7</span>
                  )}
                </div>
                {exState.exercise.notes && <div style={{ fontSize: 12, color: "var(--gold)", marginTop: 2 }}>{exState.exercise.notes}</div>}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{exState.exercise.muscleGroup}</div>
            </div>

            {/* Set header */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 100px", gap: 8, padding: "8px 20px", fontSize: 11, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)" }}>
              <span>Set</span><span>Reps</span><span>Weight (kg)</span><span></span>
            </div>

            {exState.sets.map((s, setIdx) => {
              const restSecs = exState.exercise.rest.includes("min")
                ? parseInt(exState.exercise.rest) * 60
                : parseInt(exState.exercise.rest);
              return (
                <div key={setIdx} style={{
                  display: "grid", gridTemplateColumns: "40px 1fr 1fr 100px",
                  gap: 8, padding: "10px 20px", alignItems: "center",
                  background: s.done ? "rgba(61,220,132,0.05)" : "transparent",
                  borderBottom: setIdx < exState.sets.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: s.done ? "var(--green)" : "var(--muted)" }}>
                    {s.done ? "✓" : setIdx + 1}
                  </span>
                  <input
                    type="number" placeholder={exState.exercise.reps.split("-")[0]}
                    value={s.reps}
                    onChange={(e) => updateSet(exIdx, setIdx, "reps", e.target.value)}
                    disabled={s.done}
                    style={{ background: "var(--dark3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 14, width: "100%", opacity: s.done ? 0.5 : 1 }}
                  />
                  <input
                    type="number" placeholder="0"
                    value={s.weight}
                    onChange={(e) => updateSet(exIdx, setIdx, "weight", e.target.value)}
                    disabled={s.done}
                    style={{ background: "var(--dark3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 14, width: "100%", opacity: s.done ? 0.5 : 1 }}
                  />
                  {!s.done ? (
                    <button onClick={() => completeSet(exIdx, setIdx, isNaN(restSecs) ? 90 : restSecs)}
                      style={{ background: "var(--gold)", border: "none", borderRadius: 6, padding: "8px", color: "var(--black)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                      Done ✓
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--green)", textAlign: "center" }}>Logged</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button className="btn-primary" style={{ width: "100%", marginTop: 32, fontSize: 18 }} onClick={finishWorkout}>
        Finish Workout →
      </button>
    </div>
  );
}
