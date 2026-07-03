import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../data/store.ts";
import { PROGRAMS } from "../data/programs.ts";
import type { Exercise } from "../data/programs.ts";
import { useTimer } from "../hooks/useTimer.ts";
import ExerciseModal from "../components/ExerciseModal.tsx";

type SetEntry = { id: string; reps: string; weight: string; done: boolean };
type ExerciseState = { exercise: Exercise; sets: SetEntry[] };

function buildInitialState(exercises: Exercise[]): ExerciseState[] {
  return exercises.map((ex) => ({
    exercise: ex,
    sets: Array.from({ length: ex.sets }, (_, i) => ({ id: `${ex.name}-${i}`, reps: "", weight: "", done: false })),
  }));
}

function parseRestSecs(restStr: string): number {
  if (restStr.includes("min")) return Number.parseInt(restStr) * 60;
  const n = Number.parseInt(restStr);
  return Number.isNaN(n) ? 90 : n;
}

function patchSet(sets: SetEntry[], idx: number, field: keyof SetEntry, value: string | boolean): SetEntry[] {
  return sets.map((s, j) => (j === idx ? { ...s, [field]: value } : s));
}

function serializeSet(s: SetEntry) {
  return { reps: Number.parseInt(s.reps) || 0, weight: Number.parseFloat(s.weight) || 0 };
}

function serializeExercise(ex: ExerciseState) {
  return { name: ex.exercise.name, sets: ex.sets.filter((s) => s.done).map(serializeSet) };
}

function calcStreak(): number {
  const logs = store.getWorkoutLogs();
  const dates = new Set(logs.map((l) => l.date.slice(0, 10)));
  let count = 0;
  const cursor = new Date();
  while (dates.has(cursor.toISOString().slice(0, 10))) { count++; cursor.setDate(cursor.getDate() - 1); }
  return count;
}

function getProgressiveSuggestion(exerciseName: string, targetRepsStr: string) {
  const lastSets = store.getLastExerciseData(exerciseName);
  if (!lastSets || lastSets.length === 0) return null;
  const weightedSets = lastSets.filter((s) => s.weight > 0);
  if (weightedSets.length === 0) return null;
  const lastAvgWeight = weightedSets.reduce((s, x) => s + x.weight, 0) / weightedSets.length;
  const lastAvgReps = lastSets.reduce((s, x) => s + x.reps, 0) / lastSets.length;
  const targetReps = Number.parseInt(targetRepsStr.split("-")[0]) || 8;
  const suggestion = lastAvgReps >= targetReps ? lastAvgWeight + 2.5 : lastAvgWeight;
  return { lastAvgWeight, lastAvgReps: Math.round(lastAvgReps), suggestion };
}

type ActiveExerciseCardProps = Readonly<{
  exState: ExerciseState;
  exIdx: number;
  onUpdateSet: (exIdx: number, setIdx: number, field: keyof SetEntry, value: string | boolean) => void;
  onCompleteSet: (exIdx: number, setIdx: number, restSec: number) => void;
  onInfoClick: (name: string) => void;
}>;

function ActiveExerciseCard({ exState, exIdx, onUpdateSet, onCompleteSet, onInfoClick }: ActiveExerciseCardProps) {
  const overload = getProgressiveSuggestion(exState.exercise.name, exState.exercise.reps);
  return (
    <div className="card">
      <div style={{ padding: "14px 20px", background: exState.exercise.fst7 ? "rgba(201,168,76,0.1)" : "var(--dark2)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{exState.exercise.name}</span>
            {exState.exercise.fst7 && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "var(--gold)", color: "var(--black)", letterSpacing: "0.06em" }}>FST-7</span>
            )}
          </div>
          {exState.exercise.notes && <div style={{ fontSize: 12, color: "var(--gold)", marginTop: 2 }}>{exState.exercise.notes}</div>}
          {overload ? (
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
              Last: <span style={{ color: "var(--text)" }}>{overload.lastAvgWeight}kg × {overload.lastAvgReps}</span>
              {" · "}Target: <span style={{ color: "var(--gold)", fontWeight: 700 }}>{overload.suggestion}kg</span>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 3 }}>First time — establish your baseline</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => onInfoClick(exState.exercise.name)}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 9px", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}
            title="Exercise guide"
          >ℹ</button>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{exState.exercise.muscleGroup}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 100px", gap: 8, padding: "8px 20px", fontSize: 11, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)" }}>
        <span>Set</span><span>Reps</span><span>Weight (kg)</span><span></span>
      </div>

      {exState.sets.map((s, setIdx) => {
        const restSecs = parseRestSecs(exState.exercise.rest);
        return (
          <div key={s.id} style={{
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
              onChange={(e) => onUpdateSet(exIdx, setIdx, "reps", e.target.value)}
              disabled={s.done}
              style={{ background: "var(--dark3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 14, width: "100%", opacity: s.done ? 0.5 : 1 }}
            />
            <input
              type="number"
              placeholder={overload ? String(overload.suggestion) : "0"}
              value={s.weight}
              onChange={(e) => onUpdateSet(exIdx, setIdx, "weight", e.target.value)}
              disabled={s.done}
              style={{ background: "var(--dark3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 14, width: "100%", opacity: s.done ? 0.5 : 1 }}
            />
            {s.done ? (
              <span style={{ fontSize: 12, color: "var(--green)", textAlign: "center" }}>Logged</span>
            ) : (
              <button onClick={() => onCompleteSet(exIdx, setIdx, restSecs)}
                style={{ background: "var(--gold)", border: "none", borderRadius: 6, padding: "8px", color: "var(--black)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Done ✓
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RatingDots({ value, onChange, color }: Readonly<{ value: number; onChange: (v: number) => void; color: string }>) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "2px solid",
            borderColor: n <= value ? color : "var(--border)",
            background: n <= value ? color : "transparent",
            cursor: "pointer", fontSize: 14, fontWeight: 700,
            color: n <= value ? "var(--black)" : "var(--muted)",
            transition: "all 0.15s",
          }}>
          {n}
        </button>
      ))}
    </div>
  );
}

export default function Workout() {
  const nav = useNavigate();
  const profile = store.getProfile();
  const program = PROGRAMS.find((p) => p.id === profile.activeProgramId);
  const timer = useTimer();
  const today = store.todayStr();
  const [started, setStarted] = useState(false);
  const [dayIndex, setDayIndex] = useState(0);
  const [state, setState] = useState<ExerciseState[]>([]);
  const [restTimer, setRestTimer] = useState<{ active: boolean; remaining: number }>({ active: false, remaining: 0 });
  const [finished, setFinished] = useState(false);
  const [readinessStep, setReadinessStep] = useState(false);
  const [readiness, setReadiness] = useState<{ sleep: number; soreness: number }>({ sleep: 0, soreness: 0 });
  const [modalExercise, setModalExercise] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const week = program?.schedule[0];
  const day = week?.days[dayIndex];

  // Auto-save completed sets every 30s so data survives a closed tab
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      const partial = state.map(serializeExercise).filter((ex) => ex.sets.length > 0);
      if (partial.length > 0) {
        localStorage.setItem(
          "fitero_workout_autosave",
          JSON.stringify({ date: today, focus: day?.focus, exercises: partial, elapsed: timer.elapsed })
        );
      }
    }, 30000);
    return () => clearInterval(id);
  }, [started, finished, state, timer.elapsed, today, day]);

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
    setReadinessStep(false);
    localStorage.removeItem("fitero_workout_autosave");
  }

  function confirmReadiness() {
    if (readiness.sleep === 0 || readiness.soreness === 0) return;
    store.saveReadiness(today, readiness);
    startWorkout();
  }

  function updateSet(exIdx: number, setIdx: number, field: keyof SetEntry, value: string | boolean) {
    setState((prev) =>
      prev.map((e, i) => (i === exIdx ? { ...e, sets: patchSet(e.sets, setIdx, field, value) } : e))
    );
  }

  function completeSet(exIdx: number, setIdx: number, restSec: number) {
    updateSet(exIdx, setIdx, "done", true);
    setRestTimer({ active: true, remaining: restSec });
  }

  function finishWorkout() {
    timer.stop();
    localStorage.removeItem("fitero_workout_autosave");
    const xp = state.reduce((sum, ex) => sum + ex.sets.filter((s) => s.done).length * 10, 0);
    store.addWorkoutLog({
      id: `${Date.now()}`,
      programId: profile.activeProgramId ?? "",
      date: today,
      focus: day?.focus ?? "",
      exercises: state.map(serializeExercise),
      durationSec: timer.elapsed,
      xp,
    });
    setFinished(true);
  }

  const completedSets = state.reduce((sum, ex) => sum + ex.sets.filter((s) => s.done).length, 0);
  const totalSets = state.reduce((sum, ex) => sum + ex.sets.length, 0);

  if (finished) {
    const xp = state.reduce((s, ex) => s + ex.sets.filter((set) => set.done).length * 10, 0);
    const streak = calcStreak();
    const topSet = state.flatMap((ex) =>
      ex.sets.filter((s) => s.done && Number.parseFloat(s.weight) > 0).map((s) => ({ name: ex.exercise.name, weight: Number.parseFloat(s.weight), reps: s.reps }))
    ).sort((a, b) => b.weight - a.weight)[0];

    function copyCard() {
      const text = [
        "🔥 FITERO WORKOUT",
        `${day?.focus ?? "Session"} · ${timer.fmt(timer.elapsed)} · ${completedSets} sets`,
        topSet ? `💪 Best: ${topSet.name} ${topSet.weight}kg × ${topSet.reps}` : "",
        streak > 1 ? `+${xp} XP · ${streak}-day streak` : `+${xp} XP`,
        "",
        "Train smarter at fitero.app",
      ].filter(Boolean).join("\n");
      navigator.clipboard.writeText(text).then(() => setCopied(true));
      setTimeout(() => setCopied(false), 2000);
    }

    return (
      <div style={{ padding: "48px 40px", maxWidth: 500, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 4 }}>SESSION<br /><span style={{ color: "var(--gold)" }}>COMPLETE</span></h1>
        </div>

        {/* Share card */}
        <div style={{ background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--gold)" }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--gold)", marginBottom: 16 }}>FITERO</div>
          <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 28, marginBottom: 4 }}>{day?.focus}</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            {timer.fmt(timer.elapsed)} · {completedSets} sets · +{xp} XP
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: topSet ? 16 : 0 }}>
            {[
              { label: "Duration", val: timer.fmt(timer.elapsed) },
              { label: "Sets Done", val: String(completedSets) },
              { label: "XP Earned", val: `+${xp}` },
              { label: "Streak", val: `${streak} day${streak !== 1 ? "s" : ""}` },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--dark3)", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 22, color: "var(--gold)" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {topSet && (
            <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>Top set: </span>
              <span style={{ fontWeight: 700 }}>{topSet.name}</span>
              <span style={{ color: "var(--gold)", fontWeight: 700 }}> {topSet.weight}kg × {topSet.reps}</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button onClick={copyCard}
            style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid var(--border)", background: copied ? "rgba(61,220,132,0.1)" : "var(--dark2)", color: copied ? "var(--green)" : "var(--muted)", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>
            {copied ? "✓ Copied!" : "Copy Summary"}
          </button>
          <button className="btn-primary" style={{ flex: 2, fontSize: 15 }} onClick={() => nav("/app")}>
            Back to Dashboard →
          </button>
        </div>
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

  // Readiness check screen
  if (readinessStep) {
    const totalScore = readiness.sleep + (6 - readiness.soreness);
    const isLow = readiness.sleep > 0 && readiness.soreness > 0 && totalScore <= 5;
    const ready = readiness.sleep > 0 && readiness.soreness > 0;
    return (
      <div style={{ padding: "48px 40px", maxWidth: 520 }}>
        <button onClick={() => setReadinessStep(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, marginBottom: 32, padding: 0 }}>
          ← Back
        </button>
        <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8 }}>HOW ARE<br /><span style={{ color: "var(--gold)" }}>YOU TODAY?</span></h1>
        <p style={{ color: "var(--muted)", marginBottom: 40, fontSize: 14 }}>This helps us gauge if you should push hard or recover smart.</p>

        <div className="card" style={{ padding: 28, marginBottom: 16 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Sleep Quality</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>1 = awful, 5 = slept like a rock</div>
            <RatingDots value={readiness.sleep} onChange={(v) => setReadiness((r) => ({ ...r, sleep: v }))} color="var(--gold)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Muscle Soreness</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>1 = feeling fresh, 5 = destroyed</div>
            <RatingDots value={readiness.soreness} onChange={(v) => setReadiness((r) => ({ ...r, soreness: v }))} color="#f87171" />
          </div>
        </div>

        {ready && (isLow ? (
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
            Low readiness detected — consider reducing weight by 10–15% and focusing on form today.
          </div>
        ) : (
          <div style={{ background: "rgba(61,220,132,0.08)", border: "1px solid rgba(61,220,132,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 16, fontSize: 13, color: "var(--green)" }}>
            You're good to go — push those PRs.
          </div>
        ))}

        <button className="btn-primary" style={{ width: "100%", fontSize: 18 }} onClick={confirmReadiness} disabled={!ready}>
          Start Session →
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 640 }}>
        <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 8 }}>TODAY'S<br /><span style={{ color: "var(--gold)" }}>WORKOUT</span></h1>
        <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 16 }}>{program.name} · Week {profile.activeWeek}</p>

        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          {week?.days.map((d) => (
            <button key={d.label}
              onClick={() => setDayIndex(week.days.indexOf(d))}
              style={{
                padding: "10px 18px", borderRadius: 8, border: "1px solid",
                borderColor: week.days.indexOf(d) === dayIndex ? "var(--gold)" : "var(--border)",
                background: week.days.indexOf(d) === dayIndex ? "rgba(201,168,76,0.12)" : "transparent",
                color: week.days.indexOf(d) === dayIndex ? "var(--gold)" : "var(--muted)",
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
              {day.exercises.map((ex) => {
                const overload = getProgressiveSuggestion(ex.name, ex.reps);
                return (
                  <div key={ex.name} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 500 }}>{ex.name}</span>
                      <span style={{ color: "var(--muted)" }}>{ex.sets}×{ex.reps} · {ex.rest}</span>
                    </div>
                    {overload && (
                      <div style={{ fontSize: 11, color: "var(--gold)", marginTop: 4 }}>
                        Last: {overload.lastAvgWeight}kg × {overload.lastAvgReps} reps · Target: {overload.suggestion}kg
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button className="btn-primary" style={{ width: "100%", fontSize: 20 }} onClick={() => setReadinessStep(true)}>
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
          <ActiveExerciseCard
            key={exState.exercise.name}
            exState={exState}
            exIdx={exIdx}
            onUpdateSet={updateSet}
            onCompleteSet={completeSet}
            onInfoClick={setModalExercise}
          />
        ))}
      </div>

      <button className="btn-primary" style={{ width: "100%", marginTop: 32, fontSize: 18 }} onClick={finishWorkout}>
        Finish Workout →
      </button>

      {modalExercise && <ExerciseModal name={modalExercise} onClose={() => setModalExercise(null)} />}
    </div>
  );
}
