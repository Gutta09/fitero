import { zodToJsonSchema } from "zod-to-json-schema";
import {
  createPlanSchema,
  logWorkoutSchema,
  getProgressSchema,
  addToCalendarSchema,
  adjustPlanSchema,
  type CreatePlanInput,
  type LogWorkoutInput,
  type GetProgressInput,
  type AddToCalendarInput,
  type AdjustPlanInput,
} from "./schemas.js";
import { createWorkoutPlan } from "./createPlan.js";
import { logWorkout } from "./logWorkout.js";
import { getProgress } from "./getProgress.js";
import { addToCalendar } from "./addToCalendar.js";
import { adjustPlan } from "./adjustPlan.js";

type ToolDefinition = {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input_schema: Record<string, any>;
  run: (args: unknown) => unknown | Promise<unknown>;
};

export const tools: ToolDefinition[] = [
  {
    name: "create_workout_plan",
    description:
      "Generate and save a structured weekly workout plan. Call this when the user wants a new plan or asks what they should train. You need their goal, days per week, and experience level — ask if any are missing.",
    input_schema: zodToJsonSchema(createPlanSchema, { $refStrategy: "none" }),
    run: (args) => createWorkoutPlan(createPlanSchema.parse(args) as CreatePlanInput),
  },
  {
    name: "log_workout",
    description:
      "Save a completed workout session to the database. Call this when the user tells you they finished a session. Capture the date, focus area, and exercises they did (sets, reps, weight).",
    input_schema: zodToJsonSchema(logWorkoutSchema, { $refStrategy: "none" }),
    run: (args) => logWorkout(logWorkoutSchema.parse(args) as LogWorkoutInput),
  },
  {
    name: "get_progress",
    description:
      "Retrieve the user's workout history and active plan. Use this when the user asks about their progress, history, or what they've been doing. Defaults to the last 4 weeks.",
    input_schema: zodToJsonSchema(getProgressSchema, { $refStrategy: "none" }),
    run: (args) => getProgress(getProgressSchema.parse(args) as GetProgressInput),
  },
  {
    name: "add_to_calendar",
    description:
      "Add workout sessions to the user's Google Calendar. Call this after creating a plan when the user wants to schedule their workouts. Ask for their preferred start time if not provided.",
    input_schema: zodToJsonSchema(addToCalendarSchema, { $refStrategy: "none" }),
    run: (args) => addToCalendar(addToCalendarSchema.parse(args) as AddToCalendarInput),
  },
  {
    name: "adjust_plan",
    description:
      "Analyse recent logged sessions vs the planned schedule and adapt next week's volume up or down. Call this at the start of a new week or when the user asks to review their plan.",
    input_schema: zodToJsonSchema(adjustPlanSchema, { $refStrategy: "none" }),
    run: (args) => adjustPlan(adjustPlanSchema.parse(args) as AdjustPlanInput),
  },
];

export async function runTool(name: string, args: unknown): Promise<unknown> {
  const tool = tools.find((t) => t.name === name);
  if (!tool) throw new Error(`Unknown tool: "${name}"`);
  return tool.run(args);
}
