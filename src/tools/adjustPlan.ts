import { planQueries, logQueries } from "../db/index.js";
import type { AdjustPlanInput } from "./schemas.js";

type WorkoutDay = {
  day: string;
  focus: string;
  exercises: { name: string; sets: number; reps: string; rest: string }[];
};

export function adjustPlan(input: AdjustPlanInput) {
  const activePlan = planQueries.getActive.get();
  if (!activePlan) {
    return { adjusted: false, reason: "No active plan found. Create a plan first." };
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - input.weeks_to_analyze * 7);
  const logs = logQueries.getSince.all(cutoff.toISOString().slice(0, 10));

  const sessionsLogged = logs.length;
  const sessionsPlanned = activePlan.days_per_week * input.weeks_to_analyze;
  const completionRate = sessionsPlanned > 0 ? sessionsLogged / sessionsPlanned : 0;

  const schedule: WorkoutDay[] = JSON.parse(activePlan.schedule);

  let adjustment: "increase" | "decrease" | "maintain";
  let message: string;

  if (completionRate < 0.6) {
    adjustment = "decrease";
    message = `You completed ${sessionsLogged}/${sessionsPlanned} planned sessions (${Math.round(completionRate * 100)}%). Reducing volume to keep things sustainable.`;
  } else if (completionRate >= 0.9) {
    adjustment = "increase";
    message = `You nailed it — ${sessionsLogged}/${sessionsPlanned} sessions (${Math.round(completionRate * 100)}%). Adding volume to keep progress moving.`;
  } else {
    adjustment = "maintain";
    message = `Solid week — ${sessionsLogged}/${sessionsPlanned} sessions (${Math.round(completionRate * 100)}%). Keeping the same volume.`;
  }

  const updatedSchedule = schedule.map((day) => ({
    ...day,
    exercises: day.exercises.map((ex) => {
      if (adjustment === "increase") {
        return { ...ex, sets: ex.sets + 1 };
      }
      if (adjustment === "decrease") {
        return { ...ex, sets: Math.max(2, ex.sets - 1) };
      }
      return ex;
    }),
  }));

  planQueries.updateSchedule.run(JSON.stringify(updatedSchedule), activePlan.id);

  return {
    adjusted: true,
    adjustment,
    completion_rate: Math.round(completionRate * 100),
    sessions_logged: sessionsLogged,
    sessions_planned: sessionsPlanned,
    message,
    updated_schedule: updatedSchedule,
  };
}
