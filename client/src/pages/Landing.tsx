import React from "react";
import { useNavigate } from "react-router-dom";
import { PROGRAMS } from "../data/programs.ts";

const TESTIMONIALS = [
  { handle: "@gymbronick", text: "103kg → 86.9kg in 12 weeks. Never had a plan this locked in.", stars: 5 },
  { handle: "@morgmovesweight", text: "The progression built in week by week is what makes it different.", stars: 5 },
  { handle: "@Samson1792", text: "Finished the FST-7 PPL twice. Strength went through the roof.", stars: 5 },
  { handle: "@classicphysique_ben", text: "Best structured program I've run. Every session has purpose.", stars: 5 },
  { handle: "@fitnesswithk", text: "Finally no guesswork. I just show up and follow the plan.", stars: 5 },
  { handle: "@iron_jules", text: "260lbs to 233lbs. The FST-7 finishing sets are brutal but they work.", stars: 5 },
];

const FEATURES = [
  {
    icon: "◈",
    title: "FST-7 Programs",
    body: "Every program ends each session with 7 pump sets — the fascia-stretching principle that maximises muscle fullness.",
  },
  {
    icon: "⏱",
    title: "Background Timer",
    body: "Rest timers keep counting even when you lock your screen or switch tabs. Never lose your place mid-set.",
  },
  {
    icon: "📊",
    title: "Strength Analytics",
    body: "Track every rep, set, and weight. Visualise your 1RM progression per lift over time.",
  },
  {
    icon: "🥩",
    title: "Nutrition Tracking",
    body: "Log calories and macros from a curated food database. Hit your daily targets and weekly averages.",
  },
  {
    icon: "🏆",
    title: "XP & Leaderboard",
    body: "Earn XP for every completed session. Climb the global leaderboard and compete with members.",
  },
  {
    icon: "🤖",
    title: "AI Coach",
    body: "Chat with an AI that adapts your program based on your progress. No more guesswork.",
  },
];

export default function Landing() {
  const nav = useNavigate();

  return (
    <div style={{ background: "var(--black)", color: "var(--text)" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px",
        background: "rgba(8,8,8,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)" }}>
          FITERO
        </span>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Programs", "Features", "Pricing"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{l}</a>
          ))}
          <button className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => nav("/onboarding")}>
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "120px 24px 80px",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)",
      }}>
        <div className="tag" style={{ marginBottom: 24 }}>Your Journey. Your Progress. Fitero.</div>
        <h1 style={{ fontSize: "clamp(56px, 10vw, 120px)", fontWeight: 900, lineHeight: 0.95, marginBottom: 32, maxWidth: 900 }}>
          STOP GUESSING<br />
          <span style={{ color: "var(--gold)" }}>YOUR NEXT</span><br />
          WORKOUT
        </h1>
        <p style={{ fontSize: 20, color: "var(--muted)", maxWidth: 540, lineHeight: 1.6, marginBottom: 48 }}>
          Science-based programs. Smart nutrition tracking. AI coaching.
          Everything you need to train with purpose.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-primary" style={{ fontSize: 20, padding: "16px 40px" }} onClick={() => nav("/onboarding")}>
            Start Your Journey →
          </button>
          <button className="btn-ghost" onClick={() => nav("/app/programs")}>
            View Programs
          </button>
        </div>
        <div style={{ marginTop: 64, display: "flex", gap: 48, color: "var(--muted)", fontSize: 14 }}>
          {[["6", "Programs"], ["4", "Methodologies"], ["60+", "Foods tracked"], ["4.8★", "Rating"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 28, color: "var(--gold)", letterSpacing: "0.02em" }}>{v}</div>
              <div style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 11 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label" style={{ textAlign: "center" }}>Everything you need</div>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, textAlign: "center", marginBottom: 64 }}>
            BUILT FOR <span style={{ color: "var(--gold)" }}>RESULTS</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ padding: "28px 28px 32px" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" style={{ padding: "100px 48px", background: "var(--dark)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label" style={{ textAlign: "center" }}>6 Proven Methodologies</div>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, textAlign: "center", marginBottom: 64 }}>
            CHOOSE YOUR <span style={{ color: "var(--gold)" }}>PROGRAM</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {PROGRAMS.map((p) => (
              <button key={p.id} className="card" onClick={() => nav(`/app/programs/${p.id}`)}
                style={{ cursor: "pointer", transition: "border-color 0.2s", borderColor: "var(--border)", textAlign: "left", background: "var(--dark)", width: "100%", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ height: 6, background: "var(--gold)", opacity: 0.7, borderRadius: "8px 8px 0 0" }} />
                <div style={{ padding: "20px 22px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold)" }}>
                      {p.level}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.weeks}w · {p.daysPerWeek}d/wk</span>
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, lineHeight: 1.1 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>{p.subtitle}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.tags.map((t) => (
                      <span key={t} style={{ fontSize: 10, padding: "2px 8px", background: "var(--dark3)", borderRadius: 20, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button className="btn-ghost" onClick={() => nav("/app/programs")}>View All Programs</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label" style={{ textAlign: "center" }}>Real results</div>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, textAlign: "center", marginBottom: 64 }}>
            YOUR JOURNEY, YOUR <span style={{ color: "var(--gold)" }}>TRANSFORMATION</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.handle} className="card" style={{ padding: "24px" }}>
                <div style={{ color: "var(--gold)", fontSize: 16, marginBottom: 12 }}>{"★".repeat(t.stars)}</div>
                <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>"{t.text}"</p>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.handle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 48px", background: "var(--dark)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="section-label">Simple pricing</div>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, marginBottom: 16 }}>
            START FOR <span style={{ color: "var(--gold)" }}>FREE</span>
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 56, fontSize: 16 }}>7-day free trial. Cancel anytime.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { label: "Monthly", price: "$19.99", sub: "per month", highlight: false },
              { label: "Annual", price: "$9.99", sub: "per month · billed $119.99/yr", highlight: true },
            ].map((plan) => (
              <div key={plan.label} className="card" style={{
                padding: "36px 28px",
                border: plan.highlight ? "1px solid var(--gold)" : "1px solid var(--border)",
                position: "relative",
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "var(--black)", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                    Best Value
                  </div>
                )}
                <div style={{ fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 16, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>{plan.label}</div>
                <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 52 }}>{plan.price}</div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 32 }}>{plan.sub}</div>
                <button className={plan.highlight ? "btn-primary" : "btn-ghost"} style={{ width: "100%" }} onClick={() => nav("/app")}>
                  Start Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", fontSize: 13 }}>
        <span style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 20, letterSpacing: "0.12em", color: "var(--text)" }}>FITERO</span>
        <span>© 2025 Fitero. All rights reserved.</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Terms", "Privacy", "Support"].map((l) => (
            <button key={l} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, padding: 0 }}>{l}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}
