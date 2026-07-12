import { describe, expect, it, vi } from "vitest";

// The plan generator persists via the db module — stub it out so tests
// exercise the pure planning logic without touching SQLite.
vi.mock("../src/db/index.js", () => ({
  planQueries: {
    insert: { run: vi.fn() },
    deactivateAll: { run: vi.fn() },
  },
}));

import { createWorkoutPlan } from "../src/tools/createPlan.js";

describe("createWorkoutPlan", () => {
  it("produces exactly daysPerWeek workout days", async () => {
    for (const days of [1, 3, 5] as const) {
      const plan = createWorkoutPlan({ goal: "muscle", daysPerWeek: days, level: "intermediate" });
      expect(plan.schedule).toHaveLength(days);
    }
  });

  it("never schedules a workout on a rest day", () => {
    const plan = createWorkoutPlan({ goal: "strength", daysPerWeek: 4, level: "intermediate" });
    expect(plan.schedule.every((d) => d.focus !== "Rest")).toBe(true);
  });

  it("scales volume down for beginners and up for advanced", () => {
    const base = createWorkoutPlan({ goal: "strength", daysPerWeek: 2, level: "intermediate" });
    const beginner = createWorkoutPlan({ goal: "strength", daysPerWeek: 2, level: "beginner" });
    const advanced = createWorkoutPlan({ goal: "strength", daysPerWeek: 2, level: "advanced" });

    for (let d = 0; d < 2; d++) {
      for (let e = 0; e < base.schedule[d].exercises.length; e++) {
        const b = base.schedule[d].exercises[e].sets;
        expect(beginner.schedule[d].exercises[e].sets).toBe(Math.max(2, b - 1));
        expect(advanced.schedule[d].exercises[e].sets).toBe(b + 1);
      }
    }
  });

  it("uses goal-appropriate focus rotations", () => {
    const fatLoss = createWorkoutPlan({ goal: "fat_loss", daysPerWeek: 5, level: "intermediate" });
    const focuses = fatLoss.schedule.map((d) => d.focus);
    expect(focuses).toContain("Cardio HIIT");

    const muscle = createWorkoutPlan({ goal: "muscle", daysPerWeek: 5, level: "intermediate" });
    expect(muscle.schedule.map((d) => d.focus)).toContain("Chest & Triceps");
  });

  it("gives level-appropriate coaching notes", () => {
    expect(
      createWorkoutPlan({ goal: "muscle", daysPerWeek: 3, level: "beginner" }).notes
    ).toMatch(/form/i);
    expect(
      createWorkoutPlan({ goal: "muscle", daysPerWeek: 3, level: "advanced" }).notes
    ).toMatch(/deload/i);
  });
});
