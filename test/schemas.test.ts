import { describe, expect, it } from "vitest";
import {
  createPlanSchema,
  logWorkoutSchema,
  addToCalendarSchema,
} from "../src/tools/schemas.js";

describe("tool input schemas", () => {
  it("accepts a valid plan request", () => {
    expect(
      createPlanSchema.safeParse({ goal: "muscle", daysPerWeek: 4, level: "beginner" }).success
    ).toBe(true);
  });

  it("rejects out-of-range days and unknown goals", () => {
    expect(
      createPlanSchema.safeParse({ goal: "muscle", daysPerWeek: 9, level: "beginner" }).success
    ).toBe(false);
    expect(
      createPlanSchema.safeParse({ goal: "cardio-blast", daysPerWeek: 3, level: "beginner" }).success
    ).toBe(false);
  });

  it("requires at least one exercise in a logged workout", () => {
    expect(
      logWorkoutSchema.safeParse({ date: "2026-07-12", focus: "Legs", exercises: [] }).success
    ).toBe(false);
    expect(
      logWorkoutSchema.safeParse({
        date: "2026-07-12",
        focus: "Legs",
        exercises: [{ name: "Squat", sets_completed: 4, reps: "5", weight_kg: 100 }],
      }).success
    ).toBe(true);
  });

  it("bounds calendar event durations", () => {
    const base = { date: "2026-07-14", focus: "Push", start_time: "07:00" };
    expect(
      addToCalendarSchema.safeParse({ workouts: [{ ...base, duration_minutes: 60 }] }).success
    ).toBe(true);
    expect(
      addToCalendarSchema.safeParse({ workouts: [{ ...base, duration_minutes: 600 }] }).success
    ).toBe(false);
  });
});
