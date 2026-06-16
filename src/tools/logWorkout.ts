import { planQueries, logQueries } from "../db/index.js";
import type { LogWorkoutInput } from "./schemas.js";

export function logWorkout(input: LogWorkoutInput) {
  const activePlan = planQueries.getActive.get();
  const planId = activePlan?.id ?? null;

  logQueries.insert.run(
    planId,
    input.date,
    input.focus,
    JSON.stringify(input.exercises),
    input.session_notes ?? null
  );

  return {
    saved: true,
    date: input.date,
    focus: input.focus,
    exercises_logged: input.exercises.length,
    message: `Workout logged for ${input.date}. Great work!`,
  };
}
