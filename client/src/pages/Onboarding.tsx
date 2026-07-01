import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../data/store.ts";
import type { UserProfile } from "../data/store.ts";

type Step = "identity" | "body" | "goal" | "done";

const GOALS: { id: UserProfile["goal"]; label: string; desc: string }[] = [
  { id: "muscle", label: "Build Muscle", desc: "Gain size and strength" },
  { id: "fat_loss", label: "Lose Fat", desc: "Cut while preserving muscle" },
  { id: "strength", label: "Get Stronger", desc: "Move bigger numbers" },
  { id: "tone", label: "Tone & Shape", desc: "Definition and endurance" },
];

const LEVELS: { id: UserProfile["level"]; label: string; desc: string }[] = [
  { id: "Beginner", label: "Beginner", desc: "Under 1 year training" },
  { id: "Intermediate", label: "Intermediate", desc: "1–3 years consistent" },
  { id: "Advanced", label: "Advanced", desc: "3+ years, knows their lifts" },
];

function calcTargets(p: Partial<UserProfile>): { calories: number; protein: number; carbs: number; fat: number } {
  const w = p.weightKg ?? 80;
  const h = p.heightCm ?? 175;
  const a = p.age ?? 25;
  const isFemale = p.gender === "female";
  const bmr = isFemale
    ? 10 * w + 6.25 * h - 5 * a - 161
    : 10 * w + 6.25 * h - 5 * a + 5;
  const tdee = Math.round(bmr * 1.55);
  let calories = tdee;
  if (p.goal === "muscle") calories = tdee + 250;
  if (p.goal === "fat_loss") calories = tdee - 400;
  if (p.goal === "strength") calories = tdee + 150;
  const protein = Math.round(w * 2);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, carbs, fat };
}

function recommendProgram(p: Partial<UserProfile>): string {
  const isFemale = p.gender === "female";
  if (p.level === "Beginner") return "beginner-sb";
  if (isFemale && (p.goal === "tone" || p.goal === "fat_loss")) return "glute-tone";
  if (p.goal === "strength") return "531-strength";
  if (p.goal === "muscle" && p.level === "Advanced") return "fst7-bro";
  if (p.level === "Intermediate") return "upper-lower";
  return "ppl-hypertrophy";
}

export default function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("identity");
  const [form, setForm] = useState<Partial<UserProfile>>({ gender: null, goal: null, level: null });

  function update(key: keyof UserProfile, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function finish() {
    const targets = calcTargets(form);
    const recommended = recommendProgram(form);
    const current = store.getProfile();
    store.saveProfile({
      ...current,
      name: form.name ?? "Athlete",
      gender: form.gender ?? null,
      age: form.age ?? null,
      heightCm: form.heightCm ?? null,
      weightKg: form.weightKg ?? null,
      goal: form.goal ?? null,
      level: form.level ?? null,
      onboarded: true,
      activeProgramId: recommended,
      targetCalories: targets.calories,
      targetProtein: targets.protein,
      targetCarbs: targets.carbs,
      targetFat: targets.fat,
    });
    setStep("done");
  }

  const shared: React.CSSProperties = { padding: "48px 40px", maxWidth: 560, margin: "0 auto" };
  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--dark2)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "14px 18px", color: "var(--text)", fontSize: 16, outline: "none",
    boxSizing: "border-box",
  };

  if (step === "done") {
    const prog = form.goal === "muscle" ? "Build Muscle" : form.goal === "fat_loss" ? "Lose Fat" : form.goal === "strength" ? "Strength" : "Tone";
    const targets = calcTargets(form);
    return (
      <div style={{ ...shared, textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🔥</div>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }}>
          LET'S <span style={{ color: "var(--gold)" }}>GO, {(form.name ?? "").toUpperCase()}</span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
          Your program and nutrition targets are set based on your profile.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
          {[
            { label: "Daily Calories", value: `${targets.calories} kcal` },
            { label: "Protein Target", value: `${targets.protein}g` },
            { label: "Goal", value: prog },
            { label: "Program", value: recommendProgram(form).replace(/-/g, " ").toUpperCase() },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: "20px" }}>
              <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 24, color: "var(--gold)" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ width: "100%", fontSize: 18 }} onClick={() => nav("/app")}>
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--black)", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ padding: "20px 40px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 22, color: "var(--gold)", letterSpacing: "0.12em" }}>FITERO</span>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, background: "var(--gold)", transition: "width 0.4s",
            width: step === "identity" ? "33%" : step === "body" ? "66%" : "100%",
          }} />
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          {step === "identity" ? "1 / 3" : step === "body" ? "2 / 3" : "3 / 3"}
        </span>
      </div>

      {step === "identity" && (
        <div style={shared}>
          <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8 }}>TELL US<br /><span style={{ color: "var(--gold)" }}>ABOUT YOU</span></h1>
          <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 15 }}>Takes 60 seconds. We use this to personalise your program and nutrition.</p>

          <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Your Name</label>
          <input
            style={{ ...inputStyle, marginBottom: 24 }}
            placeholder="e.g. Alex"
            value={form.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
          />

          <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Gender</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }}>
            {(["male", "female"] as const).map((g) => (
              <button key={g} onClick={() => update("gender", g)}
                style={{
                  padding: "20px", borderRadius: 12, border: "2px solid",
                  borderColor: form.gender === g ? "var(--gold)" : "var(--border)",
                  background: form.gender === g ? "rgba(201,168,76,0.1)" : "var(--dark2)",
                  color: form.gender === g ? "var(--gold)" : "var(--text)",
                  cursor: "pointer", fontSize: 16, fontWeight: 700, textTransform: "capitalize",
                }}>
                {g === "male" ? "Male" : "Female"}
              </button>
            ))}
          </div>

          <button className="btn-primary" style={{ width: "100%", fontSize: 16 }}
            onClick={() => setStep("body")}
            disabled={!form.name?.trim() || !form.gender}>
            Continue →
          </button>
        </div>
      )}

      {step === "body" && (
        <div style={shared}>
          <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8 }}>YOUR<br /><span style={{ color: "var(--gold)" }}>STATS</span></h1>
          <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 15 }}>Used to calculate your TDEE and protein targets.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[
              { key: "age" as const, label: "Age", placeholder: "25", unit: "yrs" },
              { key: "heightCm" as const, label: "Height", placeholder: "175", unit: "cm" },
              { key: "weightKg" as const, label: "Weight", placeholder: "80", unit: "kg" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                  {f.label} ({f.unit})
                </label>
                <input type="number" placeholder={f.placeholder}
                  value={(form[f.key] as number) ?? ""}
                  onChange={(e) => update(f.key, Number.parseFloat(e.target.value) || null)}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep("identity")}>← Back</button>
            <button className="btn-primary" style={{ flex: 2, fontSize: 16 }}
              onClick={() => setStep("goal")}
              disabled={!form.age || !form.heightCm || !form.weightKg}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === "goal" && (
        <div style={shared}>
          <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8 }}>YOUR<br /><span style={{ color: "var(--gold)" }}>GOAL</span></h1>
          <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 15 }}>We'll pick the right program and calorie targets for you.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            {GOALS.map((g) => (
              <button key={g.id} onClick={() => update("goal", g.id)}
                style={{
                  padding: "20px", borderRadius: 12, border: "2px solid", textAlign: "left",
                  borderColor: form.goal === g.id ? "var(--gold)" : "var(--border)",
                  background: form.goal === g.id ? "rgba(201,168,76,0.1)" : "var(--dark2)",
                  cursor: "pointer",
                }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: form.goal === g.id ? "var(--gold)" : "var(--text)", marginBottom: 4 }}>{g.label}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{g.desc}</div>
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Experience Level</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 32 }}>
            {LEVELS.map((l) => (
              <button key={l.id} onClick={() => update("level", l.id)}
                style={{
                  padding: "14px 10px", borderRadius: 10, border: "2px solid", textAlign: "center",
                  borderColor: form.level === l.id ? "var(--gold)" : "var(--border)",
                  background: form.level === l.id ? "rgba(201,168,76,0.1)" : "var(--dark2)",
                  cursor: "pointer",
                }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: form.level === l.id ? "var(--gold)" : "var(--text)", marginBottom: 2 }}>{l.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{l.desc}</div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep("body")}>← Back</button>
            <button className="btn-primary" style={{ flex: 2, fontSize: 16 }}
              onClick={finish}
              disabled={!form.goal || !form.level}>
              Build My Plan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
