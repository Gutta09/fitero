import { z } from "zod";

export const createPlanSchema = z.object({
  goal: z.enum(["strength", "muscle", "endurance", "fat_loss"]).describe(
    "The user's primary fitness goal"
  ),
  daysPerWeek: z
    .number()
    .int()
    .min(1)
    .max(7)
    .describe("Number of days per week the user can train"),
  level: z
    .enum(["beginner", "intermediate", "advanced"])
    .describe("User's experience level"),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;

export const logWorkoutSchema = z.object({
  date: z.string().describe("Date of the workout in YYYY-MM-DD format"),
  focus: z.string().describe("Session focus, e.g. 'Upper (Push)'"),
  exercises: z
    .array(
      z.object({
        name: z.string(),
        sets_completed: z.number().int().min(0),
        reps: z.string().describe("e.g. '8' or '8-10'"),
        weight_kg: z.number().optional().describe("Working weight in kg, if applicable"),
      })
    )
    .min(1),
  session_notes: z.string().optional().describe("How the session felt overall"),
});

export type LogWorkoutInput = z.infer<typeof logWorkoutSchema>;

export const getProgressSchema = z.object({
  weeks: z
    .number()
    .int()
    .min(1)
    .max(12)
    .default(4)
    .describe("How many weeks of history to retrieve"),
});

export type GetProgressInput = z.infer<typeof getProgressSchema>;

export const addToCalendarSchema = z.object({
  workouts: z.array(
    z.object({
      date: z.string().describe("Date in YYYY-MM-DD format"),
      focus: z.string(),
      start_time: z.string().describe("Start time in HH:MM 24h format, e.g. '07:00'"),
      duration_minutes: z.number().int().min(20).max(180).default(60),
    })
  ).min(1).describe("List of workout sessions to add to Google Calendar"),
});

export type AddToCalendarInput = z.infer<typeof addToCalendarSchema>;

export const adjustPlanSchema = z.object({
  weeks_to_analyze: z
    .number()
    .int()
    .min(1)
    .max(4)
    .default(1)
    .describe("How many past weeks to analyze when adapting the plan"),
});

export type AdjustPlanInput = z.infer<typeof adjustPlanSchema>;
