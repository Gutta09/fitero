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
  activeProgramId: string | null;
  activeWeek: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  xp: number;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Athlete",
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
  getProfile: () => get<UserProfile>("stndrd_profile", DEFAULT_PROFILE),
  saveProfile: (p: UserProfile) => set("stndrd_profile", p),

  getWorkoutLogs: () => get<WorkoutLog[]>("stndrd_workouts", []),
  addWorkoutLog: (log: WorkoutLog) => {
    const logs = store.getWorkoutLogs();
    logs.unshift(log);
    set("stndrd_workouts", logs);
    // award XP
    const profile = store.getProfile();
    profile.xp += log.xp;
    store.saveProfile(profile);
  },

  getNutritionLogs: () => get<NutritionLog[]>("stndrd_nutrition", []),
  getNutritionForDate: (date: string) =>
    get<NutritionLog[]>("stndrd_nutrition", []).find((l) => l.date === date) ?? null,
  saveNutritionLog: (log: NutritionLog) => {
    const logs = get<NutritionLog[]>("stndrd_nutrition", []);
    const idx = logs.findIndex((l) => l.date === log.date);
    if (idx >= 0) logs[idx] = log;
    else logs.unshift(log);
    set("stndrd_nutrition", logs);
  },

  getMeasurements: () => get<BodyMeasurement[]>("stndrd_measurements", []),
  addMeasurement: (m: BodyMeasurement) => {
    const ms = store.getMeasurements();
    const idx = ms.findIndex((x) => x.date === m.date);
    if (idx >= 0) ms[idx] = m;
    else ms.unshift(m);
    set("stndrd_measurements", ms);
  },

  todayStr: () => new Date().toISOString().slice(0, 10),
};
