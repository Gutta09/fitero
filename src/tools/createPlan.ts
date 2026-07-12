import { planQueries } from "../db/index.js";
import type { CreatePlanInput } from "./schemas.js";

type Exercise = { name: string; sets: number; reps: string; rest: string };
type WorkoutDay = { day: string; focus: string; exercises: Exercise[] };
type WorkoutPlan = {
  goal: string;
  daysPerWeek: number;
  level: string;
  schedule: WorkoutDay[];
  notes: string;
};

const FOCUS_ROTATION: Record<string, string[]> = {
  strength: ["Lower (Squat focus)", "Upper (Push)", "Rest", "Lower (Hinge focus)", "Upper (Pull)", "Rest", "Rest"],
  muscle: ["Chest & Triceps", "Back & Biceps", "Rest", "Legs", "Shoulders & Arms", "Rest", "Rest"],
  endurance: ["Full Body Circuit", "Cardio", "Rest", "Full Body Circuit", "Cardio", "Active Recovery", "Rest"],
  fat_loss: ["Full Body", "Cardio HIIT", "Rest", "Full Body", "Cardio HIIT", "Active Recovery", "Rest"],
};

const EXERCISE_BANK: Record<string, Exercise[]> = {
  "Lower (Squat focus)": [
    { name: "Back Squat", sets: 4, reps: "5", rest: "3 min" },
    { name: "Romanian Deadlift", sets: 3, reps: "8", rest: "2 min" },
    { name: "Leg Press", sets: 3, reps: "10", rest: "90 sec" },
    { name: "Walking Lunge", sets: 3, reps: "12 each", rest: "90 sec" },
  ],
  "Lower (Hinge focus)": [
    { name: "Deadlift", sets: 4, reps: "5", rest: "3 min" },
    { name: "Front Squat", sets: 3, reps: "6", rest: "2 min" },
    { name: "Leg Curl", sets: 3, reps: "10", rest: "90 sec" },
    { name: "Calf Raise", sets: 4, reps: "15", rest: "60 sec" },
  ],
  "Upper (Push)": [
    { name: "Bench Press", sets: 4, reps: "5", rest: "3 min" },
    { name: "Overhead Press", sets: 3, reps: "8", rest: "2 min" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10", rest: "90 sec" },
    { name: "Tricep Dips", sets: 3, reps: "12", rest: "60 sec" },
  ],
  "Upper (Pull)": [
    { name: "Barbell Row", sets: 4, reps: "5", rest: "3 min" },
    { name: "Pull-Up", sets: 3, reps: "6-8", rest: "2 min" },
    { name: "Face Pull", sets: 3, reps: "15", rest: "60 sec" },
    { name: "Barbell Curl", sets: 3, reps: "10", rest: "60 sec" },
  ],
  "Chest & Triceps": [
    { name: "Bench Press", sets: 4, reps: "8-10", rest: "2 min" },
    { name: "Incline Dumbbell Fly", sets: 3, reps: "12", rest: "90 sec" },
    { name: "Cable Crossover", sets: 3, reps: "15", rest: "60 sec" },
    { name: "Skull Crusher", sets: 3, reps: "12", rest: "60 sec" },
  ],
  "Back & Biceps": [
    { name: "Pull-Up", sets: 4, reps: "8-10", rest: "2 min" },
    { name: "Seated Cable Row", sets: 3, reps: "12", rest: "90 sec" },
    { name: "Lat Pulldown", sets: 3, reps: "12", rest: "90 sec" },
    { name: "Dumbbell Curl", sets: 3, reps: "12", rest: "60 sec" },
  ],
  Legs: [
    { name: "Squat", sets: 4, reps: "10-12", rest: "2 min" },
    { name: "Leg Press", sets: 3, reps: "15", rest: "90 sec" },
    { name: "Leg Curl", sets: 3, reps: "12", rest: "90 sec" },
    { name: "Calf Raise", sets: 4, reps: "20", rest: "60 sec" },
  ],
  "Shoulders & Arms": [
    { name: "Overhead Press", sets: 4, reps: "10", rest: "2 min" },
    { name: "Lateral Raise", sets: 3, reps: "15", rest: "60 sec" },
    { name: "Barbell Curl", sets: 3, reps: "12", rest: "60 sec" },
    { name: "Tricep Pushdown", sets: 3, reps: "15", rest: "60 sec" },
  ],
  "Full Body Circuit": [
    { name: "Squat", sets: 3, reps: "12", rest: "60 sec" },
    { name: "Push-Up", sets: 3, reps: "15", rest: "60 sec" },
    { name: "Dumbbell Row", sets: 3, reps: "12", rest: "60 sec" },
    { name: "Plank", sets: 3, reps: "45 sec", rest: "45 sec" },
  ],
  "Full Body": [
    { name: "Squat", sets: 3, reps: "10-12", rest: "90 sec" },
    { name: "Dumbbell Press", sets: 3, reps: "10-12", rest: "90 sec" },
    { name: "Dumbbell Row", sets: 3, reps: "10-12", rest: "90 sec" },
    { name: "Romanian Deadlift", sets: 3, reps: "12", rest: "90 sec" },
  ],
  "Cardio HIIT": [
    { name: "Sprint Intervals (20s on / 40s off)", sets: 8, reps: "1 round", rest: "40 sec" },
    { name: "Jump Rope", sets: 3, reps: "2 min", rest: "60 sec" },
    { name: "Burpees", sets: 3, reps: "10", rest: "60 sec" },
  ],
  Cardio: [
    { name: "Steady-State Cardio (run / cycle / row)", sets: 1, reps: "30-40 min", rest: "—" },
  ],
  "Active Recovery": [
    { name: "Light Walk", sets: 1, reps: "20-30 min", rest: "—" },
    { name: "Foam Roll (full body)", sets: 1, reps: "10 min", rest: "—" },
    { name: "Stretching", sets: 1, reps: "10 min", rest: "—" },
  ],
};

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function scaleExercises(exercises: Exercise[], level: CreatePlanInput["level"]): Exercise[] {
  return exercises.map((ex) => {
    if (level === "beginner") {
      return { ...ex, sets: Math.max(2, ex.sets - 1) };
    }
    if (level === "advanced") {
      return { ...ex, sets: ex.sets + 1 };
    }
    return ex;
  });
}

export function createWorkoutPlan(input: CreatePlanInput): WorkoutPlan {
  const focusRotation = FOCUS_ROTATION[input.goal];
  const schedule: WorkoutDay[] = [];

  // First pass: honour the rotation's rest-day placement.
  const workoutDayIndices: number[] = [];
  const restDayIndices: number[] = [];
  for (let i = 0; i < 7; i++) {
    if (focusRotation[i] === "Rest") restDayIndices.push(i);
    else workoutDayIndices.push(i);
  }

  // If the user trains more days than the rotation has non-rest slots
  // (e.g. a 6-day "muscle" split), spill onto the rotation's rest days —
  // otherwise a 6-day request would silently return a 4-day plan.
  const chosenDays = [...workoutDayIndices, ...restDayIndices].slice(0, input.daysPerWeek);
  chosenDays.sort((a, b) => a - b);

  const nonRestFocuses = focusRotation.filter((f) => f !== "Rest");
  let focusIdx = 0;
  for (const dayIdx of chosenDays) {
    const focus =
      focusRotation[dayIdx] !== "Rest"
        ? focusRotation[dayIdx]
        : nonRestFocuses[focusIdx % nonRestFocuses.length];
    focusIdx++;

    const raw = EXERCISE_BANK[focus] ?? EXERCISE_BANK["Full Body"];
    schedule.push({
      day: DAYS_OF_WEEK[dayIdx],
      focus,
      exercises: scaleExercises(raw, input.level),
    });
  }

  const notes: Record<CreatePlanInput["level"], string> = {
    beginner: "Focus on form over load. Add weight only when all sets feel controlled.",
    intermediate: "Progressive overload: aim to add small weight or one rep each week.",
    advanced: "Track your lifts. Deload every 4th week to avoid burnout.",
  };

  const plan: WorkoutPlan = {
    goal: input.goal,
    daysPerWeek: input.daysPerWeek,
    level: input.level,
    schedule,
    notes: notes[input.level],
  };

  // Persist to DB — deactivate previous plan first
  planQueries.deactivateAll.run();
  planQueries.insert.run(
    plan.goal,
    plan.daysPerWeek,
    plan.level,
    JSON.stringify(plan.schedule),
    plan.notes
  );

  return plan;
}
