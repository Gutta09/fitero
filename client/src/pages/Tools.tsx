import React, { useState } from "react";

// Epley formula
function calc1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

const REP_PERCENTAGES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15];

const PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];
const BARBELL_KG = 20;

function calcPlates(target: number, barbell: number): { plate: number; count: number }[] {
  let remaining = (target - barbell) / 2;
  const result: { plate: number; count: number }[] = [];
  for (const p of PLATES_KG) {
    if (remaining <= 0) break;
    const count = Math.floor(remaining / p);
    if (count > 0) { result.push({ plate: p, count }); remaining -= count * p; }
  }
  return result;
}

const TDEE_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

export default function Tools() {
  // 1RM
  const [rmWeight, setRmWeight] = useState("");
  const [rmReps, setRmReps] = useState("");
  const rm = rmWeight && rmReps ? calc1RM(parseFloat(rmWeight), parseInt(rmReps)) : null;

  // Plate calc
  const [plateTarget, setPlateTarget] = useState("");
  const plates = plateTarget ? calcPlates(parseFloat(plateTarget), BARBELL_KG) : [];
  const achievable = BARBELL_KG + plates.reduce((s, p) => s + p.plate * p.count * 2, 0);

  // TDEE
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState("moderate");
  const tdee = (() => {
    if (!age || !weight || !height) return null;
    const a = parseInt(age), w = parseFloat(weight), h = parseFloat(height);
    const bmr = sex === "male"
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
      : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
    return Math.round(bmr * (TDEE_MULTIPLIERS[activity] ?? 1.55));
  })();

  const inputStyle = {
    background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 8,
    padding: "12px 14px", color: "var(--text)", fontSize: 15, width: "100%", outline: "none",
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 8 }}>TOOLS</h1>
      <p style={{ color: "var(--muted)", marginBottom: 40 }}>Calculators the app doesn't have.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* 1RM Calculator */}
        <div className="card" style={{ padding: "28px" }}>
          <div className="section-label">1 Rep Max Calculator</div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Epley formula. Enter your working set weight and reps.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Weight (kg)</label>
              <input type="number" placeholder="100" value={rmWeight} onChange={(e) => setRmWeight(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Reps</label>
              <input type="number" placeholder="5" value={rmReps} onChange={(e) => setRmReps(e.target.value)} style={inputStyle} />
            </div>
          </div>
          {rm && (
            <>
              <div style={{ background: "var(--dark3)", borderRadius: 8, padding: "16px 20px", marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Estimated 1RM</div>
                <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 52, color: "var(--gold)" }}>{rm} kg</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {REP_PERCENTAGES.map((r) => {
                  const pct = r === 1 ? 100 : Math.round((1 - r / 40) * 100);
                  const w = Math.round(rm * pct / 100);
                  return (
                    <div key={r} style={{ background: "var(--dark3)", borderRadius: 6, padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase" }}>{r}RM</div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{w}kg</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Plate Calculator */}
        <div className="card" style={{ padding: "28px" }}>
          <div className="section-label">Plate Calculator</div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Standard 20kg bar. Shows plates per side.</p>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Target Weight (kg)</label>
            <input type="number" placeholder="100" value={plateTarget} onChange={(e) => setPlateTarget(e.target.value)} style={inputStyle} />
          </div>
          {plateTarget && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                <span>Bar: 20kg</span>
                <span>Achievable: <strong style={{ color: "var(--gold)" }}>{achievable}kg</strong></span>
              </div>
              {plates.length === 0 ? (
                <div style={{ color: "var(--muted)", fontSize: 14 }}>Target too low for plates.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {plates.map(({ plate, count }) => (
                    <div key={plate} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 20, color: "var(--gold)", width: 60 }}>{plate}kg</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        {Array.from({ length: count }, (_, i) => (
                          <div key={i} style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: plate >= 20 ? "var(--red)" : plate >= 10 ? "var(--blue)" : plate >= 5 ? "var(--green)" : "var(--border2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 700, color: "white",
                          }}>
                            {plate}
                          </div>
                        ))}
                      </div>
                      <span style={{ fontSize: 13, color: "var(--muted)" }}>× {count} per side</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* TDEE Calculator */}
        <div className="card" style={{ padding: "28px", gridColumn: "1 / -1" }}>
          <div className="section-label">TDEE Calculator</div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Mifflin-St Jeor. Total Daily Energy Expenditure for your calorie targets.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 20 }}>
            {[
              { label: "Age", val: age, set: setAge, placeholder: "25" },
              { label: "Weight (kg)", val: weight, set: setWeight, placeholder: "80" },
              { label: "Height (cm)", val: height, set: setHeight, placeholder: "180" },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type="number" placeholder={f.placeholder} value={f.val} onChange={(e) => f.set(e.target.value)} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Sex</label>
              <select value={sex} onChange={(e) => setSex(e.target.value as "male" | "female")}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Activity Level</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="sedentary">Sedentary (desk job)</option>
                <option value="light">Light (1-3x/wk)</option>
                <option value="moderate">Moderate (3-5x/wk)</option>
                <option value="active">Active (6-7x/wk)</option>
                <option value="very">Very Active (2× daily)</option>
              </select>
            </div>
          </div>
          {tdee && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "Maintenance", kcal: tdee, desc: "Stay same weight" },
                { label: "Lean Bulk", kcal: tdee + 250, desc: "+250 kcal surplus" },
                { label: "Bulk", kcal: tdee + 500, desc: "+500 kcal surplus" },
                { label: "Cut", kcal: tdee - 500, desc: "–500 kcal deficit" },
              ].map((g) => (
                <div key={g.label} style={{ background: "var(--dark3)", borderRadius: 8, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{g.label}</div>
                  <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 34, color: "var(--gold)" }}>{g.kcal.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 4 }}>{g.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
