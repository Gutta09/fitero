// Simple localStorage-backed state — no Redux needed for a personal app

export type WorkoutLog = {
  id: string;
  programId: string;
  date: string;
  focus: string;
  exercises: { name: string; sets: { reps: number; weight: number }[] }[];
  durationSec: number;
  xp: number;
};

export type NutritionLog = {
  id: string;
  date: string;
  meals: { name: string; foods: { foodId: string; name: string; grams: number; calories: number; protein: number; carbs: number; fat: number }[] }[];
};

export type BodyMeasurement = {
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  calves?: number;
};

export type UserProfile = {
  name: string;
  gender: "male" | "female" | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  goal: "muscle" | "fat_loss" | "strength" | "tone" | null;
  level: "Beginner" | "Intermediate" | "Advanced" | null;
  onboarded: boolean;
  activeProgramId: string | null;
  activeWeek: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  xp: number;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  gender: null,
  age: null,
  heightCm: null,
  weightKg: null,
  goal: null,
  level: null,
  onboarded: false,
  activeProgramId: null,
  activeWeek: 1,
  targetCalories: 2500,
  targetProtein: 180,
  targetCarbs: 280,
  targetFat: 70,
  xp: 0,
};

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getProfile: () => get<UserProfile>("fitero_profile", DEFAULT_PROFILE),
  saveProfile: (p: UserProfile) => set("fitero_profile", p),

  getWorkoutLogs: () => get<WorkoutLog[]>("fitero_workouts", []),
  addWorkoutLog: (log: WorkoutLog) => {
    const logs = store.getWorkoutLogs();
    logs.unshift(log);
    set("fitero_workouts", logs);
    const profile = store.getProfile();
    profile.xp += log.xp;
    store.saveProfile(profile);
  },

  getNutritionLogs: () => get<NutritionLog[]>("fitero_nutrition", []),
  getNutritionForDate: (date: string) =>
    get<NutritionLog[]>("fitero_nutrition", []).find((l) => l.date === date) ?? null,
  saveNutritionLog: (log: NutritionLog) => {
    const logs = get<NutritionLog[]>("fitero_nutrition", []);
    const idx = logs.findIndex((l) => l.date === log.date);
    if (idx >= 0) logs[idx] = log;
    else logs.unshift(log);
    set("fitero_nutrition", logs);
  },

  getMeasurements: () => get<BodyMeasurement[]>("fitero_measurements", []),
  addMeasurement: (m: BodyMeasurement) => {
    const ms = store.getMeasurements();
    const idx = ms.findIndex((x) => x.date === m.date);
    if (idx >= 0) ms[idx] = m;
    else ms.unshift(m);
    set("fitero_measurements", ms);
  },

  getLastExerciseData: (exerciseName: string): { reps: number; weight: number }[] | null => {
    const logs = get<WorkoutLog[]>("fitero_workouts", []);
    for (const log of logs) {
      const ex = log.exercises.find((e) => e.name === exerciseName);
      if (ex && ex.sets.length > 0) return ex.sets;
    }
    return null;
  },

  getWaterToday: (date: string) => get<number>(`fitero_water_${date}`, 0),
  setWaterToday: (date: string, glasses: number) => set(`fitero_water_${date}`, glasses),

  getReadiness: (date: string) => get<{ sleep: number; soreness: number } | null>(`fitero_readiness_${date}`, null),
  saveReadiness: (date: string, data: { sleep: number; soreness: number }) => set(`fitero_readiness_${date}`, data),

  todayStr: () => new Date().toISOString().slice(0, 10),
};
