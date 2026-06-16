import React, { useState } from "react";
import { store } from "../data/store.ts";
import { searchFoods } from "../data/foods.ts";
import type { Food } from "../data/foods.ts";
import type { NutritionLog } from "../data/store.ts";

type LoggedFood = { foodId: string; name: string; grams: number; calories: number; protein: number; carbs: number; fat: number };

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export default function Nutrition() {
  const today = store.todayStr();
  const profile = store.getProfile();
  const [log, setLog] = useState<NutritionLog>(() =>
    store.getNutritionForDate(today) ?? {
      id: today,
      date: today,
      meals: MEALS.map((name) => ({ name, foods: [] })),
    }
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [activeMeal, setActiveMeal] = useState(0);
  const [grams, setGrams] = useState<Record<string, number>>({});
  const [editingGoals, setEditingGoals] = useState(false);
  const [goals, setGoals] = useState({ calories: profile.targetCalories, protein: profile.targetProtein, carbs: profile.targetCarbs, fat: profile.targetFat });

  function search(q: string) {
    setQuery(q);
    setResults(q.length >= 2 ? searchFoods(q) : []);
  }

  function addFood(food: Food) {
    const g = grams[food.id] ?? 100;
    const scale = g / 100;
    const entry: LoggedFood = {
      foodId: food.id,
      name: food.name,
      grams: g,
      calories: Math.round(food.calories * scale),
      protein: Math.round(food.protein * scale * 10) / 10,
      carbs: Math.round(food.carbs * scale * 10) / 10,
      fat: Math.round(food.fat * scale * 10) / 10,
    };
    const updated: NutritionLog = {
      ...log,
      meals: log.meals.map((m, i) =>
        i === activeMeal ? { ...m, foods: [...m.foods, entry] } : m
      ),
    };
    setLog(updated);
    store.saveNutritionLog(updated);
    setQuery(""); setResults([]);
  }

  function removeFood(mealIdx: number, foodIdx: number) {
    const updated: NutritionLog = {
      ...log,
      meals: log.meals.map((m, i) =>
        i === mealIdx ? { ...m, foods: m.foods.filter((_, j) => j !== foodIdx) } : m
      ),
    };
    setLog(updated);
    store.saveNutritionLog(updated);
  }

  function saveGoals() {
    const p = store.getProfile();
    p.targetCalories = goals.calories;
    p.targetProtein = goals.protein;
    p.targetCarbs = goals.carbs;
    p.targetFat = goals.fat;
    store.saveProfile(p);
    setEditingGoals(false);
  }

  const totals = log.meals.reduce(
    (acc, meal) => {
      meal.foods.forEach((f) => { acc.calories += f.calories; acc.protein += f.protein; acc.carbs += f.carbs; acc.fat += f.fat; });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const macroColor = { protein: "#4a9eff", carbs: "var(--gold)", fat: "var(--green)" };

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 4 }}>NUTRITION</h1>
          <p style={{ color: "var(--muted)" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => setEditingGoals(!editingGoals)}>
          {editingGoals ? "Cancel" : "Edit Goals"}
        </button>
      </div>

      {editingGoals && (
        <div className="card" style={{ padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Daily Targets</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
            {(["calories", "protein", "carbs", "fat"] as const).map((k) => (
              <div key={k}>
                <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                  {k}{k !== "calories" ? " (g)" : " (kcal)"}
                </label>
                <input type="number" value={goals[k]}
                  onChange={(e) => setGoals((g) => ({ ...g, [k]: parseInt(e.target.value) || 0 }))}
                  style={{ width: "100%", background: "var(--dark3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--text)", fontSize: 16 }}
                />
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={saveGoals}>Save Targets</button>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>Calories</div>
          <div style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 48, color: "var(--gold)", lineHeight: 1 }}>
            {Math.round(totals.calories)}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>/ {goals.calories} kcal</div>
          <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, marginTop: 16, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (totals.calories / goals.calories) * 100)}%`, background: "var(--gold)", borderRadius: 3 }} />
          </div>
        </div>
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {(["protein", "carbs", "fat"] as const).map((k) => (
              <div key={k}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{k}</span>
                  <span style={{ color: "var(--muted)" }}>{Math.round(totals[k])}g / {goals[k]}g</span>
                </div>
                <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (totals[k] / goals[k]) * 100)}%`, background: macroColor[k], borderRadius: 4 }} />
                </div>
                <div style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 28, marginTop: 8, color: macroColor[k] }}>
                  {Math.round(totals[k])}g
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {MEALS.map((m, i) => (
          <button key={m} onClick={() => setActiveMeal(i)}
            style={{
              padding: "10px 18px", borderRadius: 8, border: "1px solid",
              borderColor: i === activeMeal ? "var(--gold)" : "var(--border)",
              background: i === activeMeal ? "rgba(201,168,76,0.1)" : "transparent",
              color: i === activeMeal ? "var(--gold)" : "var(--muted)",
              fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 14,
              textTransform: "uppercase", cursor: "pointer",
            }}>
            {m}
          </button>
        ))}
      </div>

      {/* Food search */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <input
          placeholder={`Search foods to add to ${MEALS[activeMeal]}…`}
          value={query}
          onChange={(e) => search(e.target.value)}
          style={{ width: "100%", background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", color: "var(--text)", fontSize: 15, outline: "none" }}
        />
        {results.length > 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 10, zIndex: 20, overflow: "hidden" }}>
            {results.map((f) => (
              <div key={f.id} style={{ padding: "12px 18px", cursor: "pointer", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--dark3)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{f.servingSize} · {f.calories} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="number" placeholder="100"
                    defaultValue={100}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setGrams((g) => ({ ...g, [f.id]: parseInt(e.target.value) || 100 }))}
                    style={{ width: 64, background: "var(--dark3)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px", color: "var(--text)", fontSize: 13, textAlign: "center" }}
                  />
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>g</span>
                  <button onClick={() => addFood(f)} className="btn-primary" style={{ padding: "6px 14px", fontSize: 13 }}>Add</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meal logs */}
      {log.meals.map((meal, mi) => (
        meal.foods.length > 0 && (
          <div key={mi} className="card" style={{ marginBottom: 16 }}>
            <div style={{ padding: "12px 20px", background: "var(--dark2)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 18 }}>{meal.name}</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                {Math.round(meal.foods.reduce((s, f) => s + f.calories, 0))} kcal
              </span>
            </div>
            {meal.foods.map((f, fi) => (
              <div key={fi} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: fi < meal.foods.length - 1 ? "1px solid var(--border)" : "none", fontSize: 14 }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    {f.grams}g · P:{f.protein}g C:{f.carbs}g F:{f.fat}g
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>{f.calories} kcal</span>
                  <button onClick={() => removeFood(mi, fi)} style={{ background: "none", border: "none", color: "var(--muted2)", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  );
}
