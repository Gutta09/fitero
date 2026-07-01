import React from "react";
import { getExerciseInfo } from "../data/exerciseInfo.ts";

export default function ExerciseModal({ name, onClose }: Readonly<{ name: string; onClose: () => void }>) {
  const info = getExerciseInfo(name);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--dark)", border: "1px solid var(--border)", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "85dvh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Exercise Guide</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{name.split("(")[0].trim()}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: "0 0 0 16px" }}>✕</button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {info ? (
            <>
              {/* Muscles */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold)", marginBottom: 8 }}>Primary Muscles</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {info.muscles.map((m) => (
                    <span key={m} style={{ fontSize: 12, padding: "4px 10px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, color: "var(--gold)", fontWeight: 600 }}>{m}</span>
                  ))}
                  {info.secondary?.map((m) => (
                    <span key={m} style={{ fontSize: 12, padding: "4px 10px", background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 20, color: "var(--muted)" }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Form cues */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--green)", marginBottom: 10 }}>Form Cues</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {info.cues.map((cue, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 16, color: "var(--green)", minWidth: 20, lineHeight: 1.4 }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>{cue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mistakes */}
              <div style={{ marginBottom: info.alternatives ? 20 : 0, background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f87171", marginBottom: 10 }}>Common Mistakes</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {info.mistakes.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "#f87171", fontSize: 14, minWidth: 14, marginTop: 1 }}>✕</span>
                      <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternatives */}
              {info.alternatives && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 8 }}>No Equipment? Try Instead</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {info.alternatives.map((a) => (
                      <span key={a} style={{ fontSize: 12, padding: "4px 10px", background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 20, color: "var(--muted)" }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <p style={{ fontSize: 14 }}>No guide available yet for this exercise.<br />Focus on controlled movement and full range of motion.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
