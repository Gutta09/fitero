import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PROGRAMS } from "../data/programs.ts";
import { store } from "../data/store.ts";

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "var(--green)",
  Intermediate: "var(--gold)",
  Advanced: "var(--red)",
};

export function ProgramsList() {
  const nav = useNavigate();
  const profile = store.getProfile();

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 8 }}>
        PROGRAMS
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: 40 }}>
        FST-7 based training. Every session ends with 7 pump sets to stretch the fascia and maximise fullness.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {PROGRAMS.map((p) => {
          const isActive = profile.activeProgramId === p.id;
          return (
            <div key={p.id} className="card"
              style={{ cursor: "pointer", transition: "border-color 0.2s", border: isActive ? "1px solid var(--gold)" : "1px solid var(--border)" }}
              onClick={() => nav(`/app/programs/${p.id}`)}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = "var(--border2)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <div style={{ height: 4, background: LEVEL_COLOR[p.level] ?? "var(--gold)" }} />
              <div style={{ padding: "22px 24px 26px" }}>
                {isActive && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    ● Active Program
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: LEVEL_COLOR[p.level], textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {p.level}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.weeks}w · {p.daysPerWeek}d/wk</span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, lineHeight: 1.1 }}>{p.name}</h2>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>{p.subtitle}</p>
                <p style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.6, marginBottom: 18 }}>{p.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ fontSize: 10, padding: "3px 9px", background: "var(--dark3)", borderRadius: 20, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const program = PROGRAMS.find((p) => p.id === id);
  const profile = store.getProfile();

  if (!program) return (
    <div style={{ padding: 40, color: "var(--muted)" }}>Program not found.</div>
  );

  const isActive = profile.activeProgramId === program.id;

  function startProgram() {
    const p = store.getProfile();
    p.activeProgramId = program!.id;
    p.activeWeek = 1;
    store.saveProfile(p);
    nav("/app");
  }

  const week = program.schedule[0];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <button style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", marginBottom: 24, fontSize: 14 }} onClick={() => nav("/app/programs")}>
        ← Back to Programs
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 12, color: LEVEL_COLOR[program.level], fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            {program.level} · FST-7
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 8 }}>{program.name}</h1>
          <p style={{ color: "var(--muted)", fontSize: 16 }}>{program.description}</p>
        </div>
        <button
          className={isActive ? "btn-ghost" : "btn-primary"}
          style={{ flexShrink: 0, marginLeft: 32 }}
          onClick={startProgram}
        >
          {isActive ? "Already Active ✓" : "Start Program"}
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 24, marginBottom: 40 }}>
        {[
          { label: "Duration", value: `${program.weeks} weeks` },
          { label: "Frequency", value: `${program.daysPerWeek} days/week` },
          { label: "Goal", value: program.goal },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "16px 22px", flex: 1 }}>
            <div style={{ fontSize: 20, fontFamily: "Barlow Condensed", fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Week schedule */}
      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Week 1 Schedule</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {week.days.map((day, di) => (
          <div key={di} className="card" style={{ overflow: "visible" }}>
            <div style={{ padding: "14px 20px", background: "var(--dark2)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
              <div>
                <span style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 18 }}>{day.label}</span>
                <span style={{ color: "var(--gold)", marginLeft: 12, fontSize: 14, fontWeight: 600 }}>{day.focus}</span>
              </div>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{day.exercises.length} exercises</span>
            </div>
            <div>
              {day.exercises.map((ex, ei) => (
                <div key={ei} style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto auto",
                  padding: "11px 20px", alignItems: "center", gap: 16,
                  borderBottom: ei < day.exercises.length - 1 ? "1px solid var(--border)" : "none",
                  fontSize: 14,
                  background: ex.fst7 ? "rgba(201,168,76,0.06)" : "transparent",
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{ex.name}</span>
                      {ex.fst7 && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "var(--gold)", color: "var(--black)", letterSpacing: "0.06em" }}>
                          FST-7
                        </span>
                      )}
                    </div>
                    {ex.notes && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{ex.notes}</div>}
                  </div>
                  <span style={{ color: ex.fst7 ? "var(--gold)" : "var(--muted)", fontWeight: ex.fst7 ? 700 : 400, fontSize: 13, whiteSpace: "nowrap" }}>{ex.sets} sets</span>
                  <span style={{ color: "var(--muted)", fontSize: 13, whiteSpace: "nowrap" }}>{ex.reps} reps</span>
                  <span style={{ color: "var(--muted2)", fontSize: 12, whiteSpace: "nowrap" }}>Rest {ex.rest}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
