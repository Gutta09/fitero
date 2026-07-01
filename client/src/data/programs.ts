export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  muscleGroup: string;
  fst7?: boolean;
};

export type WorkoutDay = {
  label: string;
  focus: string;
  exercises: Exercise[];
};

export type Week = {
  weekNumber: number;
  days: WorkoutDay[];
};

export type Program = {
  id: string;
  name: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  weeks: number;
  daysPerWeek: number;
  goal: string;
  tags: string[];
  description: string;
  schedule: Week[];
};

// ── PUSH DAYS (A = bench-focused, B = shoulder-focused) ──────────────────────
const PUSH_A: Exercise[] = [
  { name: "Flat Barbell Bench Press", sets: 4, reps: "6-8", rest: "3 min", muscleGroup: "Chest", notes: "Pause 1s at chest, drive through heels" },
  { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Cable Fly", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Chest", notes: "Full stretch at bottom" },
  { name: "Seated Overhead Press", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Shoulders" },
  { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Triceps" },
  { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Triceps" },
];

const PUSH_B: Exercise[] = [
  { name: "Seated Dumbbell Overhead Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Shoulders", notes: "Full range — bring to chin level" },
  { name: "Lateral Raise", sets: 4, reps: "15-20", rest: "45 sec", muscleGroup: "Shoulders" },
  { name: "Incline Barbell Bench Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Chest" },
  { name: "Dumbbell Fly", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Chest" },
  { name: "Front Raise", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Shoulders" },
  { name: "Skullcrusher", sets: 3, reps: "10-12", rest: "75 sec", muscleGroup: "Triceps" },
];

// ── PULL DAYS (A = row-focused, B = pulldown-focused) ────────────────────────
const PULL_A: Exercise[] = [
  { name: "Barbell Row", sets: 4, reps: "6-8", rest: "3 min", muscleGroup: "Back", notes: "Bar to lower chest, control the eccentric" },
  { name: "Seated Cable Row", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Back" },
  { name: "T-Bar Row", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Back" },
  { name: "Face Pull", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "Barbell Curl", sets: 3, reps: "10-12", rest: "60 sec", muscleGroup: "Biceps" },
  { name: "Hammer Curl", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Biceps" },
];

const PULL_B: Exercise[] = [
  { name: "Weighted Pull-Up", sets: 4, reps: "6-8", rest: "3 min", muscleGroup: "Back", notes: "Full hang at bottom, chin over bar" },
  { name: "Lat Pulldown", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Back" },
  { name: "Single-Arm Dumbbell Row", sets: 3, reps: "12", rest: "75 sec", muscleGroup: "Back" },
  { name: "Rear Delt Fly", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "Incline Dumbbell Curl", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Biceps" },
  { name: "Cable Curl", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Biceps" },
];

// ── LEG DAYS (A = squat-focused, B = hip-hinge focused) ──────────────────────
const LEGS_A: Exercise[] = [
  { name: "Back Squat", sets: 4, reps: "6-8", rest: "3 min", muscleGroup: "Quads", notes: "Break parallel, knees out" },
  { name: "Leg Press", sets: 4, reps: "10-15", rest: "2 min", muscleGroup: "Quads" },
  { name: "Bulgarian Split Squat", sets: 3, reps: "10", rest: "90 sec", muscleGroup: "Quads" },
  { name: "Leg Extension", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Quads" },
  { name: "Seated Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Calves" },
];

const LEGS_B: Exercise[] = [
  { name: "Romanian Deadlift", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Hamstrings", notes: "Push hips back, feel the hamstring stretch" },
  { name: "Leg Curl", sets: 4, reps: "12-15", rest: "90 sec", muscleGroup: "Hamstrings" },
  { name: "Hack Squat", sets: 3, reps: "12-15", rest: "2 min", muscleGroup: "Quads" },
  { name: "Hip Thrust", sets: 3, reps: "12-15", rest: "90 sec", muscleGroup: "Glutes" },
  { name: "Standing Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Calves" },
];

// ── UPPER / LOWER ─────────────────────────────────────────────────────────────
const UPPER_STRENGTH: Exercise[] = [
  { name: "Flat Barbell Bench Press", sets: 4, reps: "5", rest: "3 min", muscleGroup: "Chest", notes: "Heavy work — rest fully between sets" },
  { name: "Barbell Row", sets: 4, reps: "5", rest: "3 min", muscleGroup: "Back" },
  { name: "Overhead Press", sets: 3, reps: "6-8", rest: "2 min", muscleGroup: "Shoulders" },
  { name: "Weighted Pull-Up", sets: 3, reps: "6-8", rest: "2 min", muscleGroup: "Back" },
  { name: "EZ-Bar Curl", sets: 3, reps: "10-12", rest: "60 sec", muscleGroup: "Biceps" },
  { name: "Skullcrusher", sets: 3, reps: "10-12", rest: "60 sec", muscleGroup: "Triceps" },
];

const UPPER_VOLUME: Exercise[] = [
  { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Seated Cable Row", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Back" },
  { name: "Lateral Raise", sets: 4, reps: "15-20", rest: "45 sec", muscleGroup: "Shoulders" },
  { name: "Lat Pulldown", sets: 3, reps: "12-15", rest: "75 sec", muscleGroup: "Back" },
  { name: "Cable Fly", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Chest" },
  { name: "Face Pull", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "Incline Dumbbell Curl", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Biceps" },
  { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Triceps" },
];

const LOWER_STRENGTH: Exercise[] = [
  { name: "Back Squat", sets: 4, reps: "5", rest: "3 min", muscleGroup: "Quads", notes: "Working weight — add 2.5kg/week" },
  { name: "Romanian Deadlift", sets: 3, reps: "6-8", rest: "2 min", muscleGroup: "Hamstrings" },
  { name: "Leg Press", sets: 3, reps: "8-10", rest: "2 min", muscleGroup: "Quads" },
  { name: "Leg Curl", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Hamstrings" },
  { name: "Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Calves" },
];

const LOWER_VOLUME: Exercise[] = [
  { name: "Front Squat", sets: 4, reps: "10-12", rest: "2 min", muscleGroup: "Quads" },
  { name: "Leg Press", sets: 4, reps: "12-15", rest: "90 sec", muscleGroup: "Quads" },
  { name: "Leg Curl", sets: 4, reps: "12-15", rest: "90 sec", muscleGroup: "Hamstrings" },
  { name: "Bulgarian Split Squat", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Quads" },
  { name: "Hip Thrust", sets: 3, reps: "12-15", rest: "75 sec", muscleGroup: "Glutes" },
  { name: "Leg Extension", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Quads" },
  { name: "Standing Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Calves" },
];

// ── BRO SPLIT ─────────────────────────────────────────────────────────────────
const CHEST_BACK_DAY: Exercise[] = [
  { name: "Flat Barbell Bench Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Chest" },
  { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Cable Fly", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Chest" },
  { name: "Barbell Row", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Back" },
  { name: "Lat Pulldown", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Back" },
  { name: "Seated Cable Row", sets: 3, reps: "12-15", rest: "75 sec", muscleGroup: "Back" },
];

const SHOULDER_ARM_DAY: Exercise[] = [
  { name: "Seated Overhead Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Shoulders" },
  { name: "Lateral Raise", sets: 4, reps: "15-20", rest: "45 sec", muscleGroup: "Shoulders" },
  { name: "Rear Delt Fly", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "EZ-Bar Curl", sets: 4, reps: "10-12", rest: "75 sec", muscleGroup: "Biceps" },
  { name: "Hammer Curl", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Biceps" },
  { name: "Close-Grip Bench Press", sets: 4, reps: "10-12", rest: "75 sec", muscleGroup: "Triceps" },
  { name: "Rope Pushdown", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Triceps" },
];

const LEGS_COMPLETE: Exercise[] = [
  { name: "Back Squat", sets: 4, reps: "6-10", rest: "3 min", muscleGroup: "Quads" },
  { name: "Romanian Deadlift", sets: 4, reps: "10-12", rest: "2 min", muscleGroup: "Hamstrings" },
  { name: "Leg Press", sets: 3, reps: "12-15", rest: "90 sec", muscleGroup: "Quads" },
  { name: "Leg Curl", sets: 3, reps: "12-15", rest: "75 sec", muscleGroup: "Hamstrings" },
  { name: "Leg Extension", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Quads" },
  { name: "Calf Raise", sets: 5, reps: "15-20", rest: "60 sec", muscleGroup: "Calves" },
];

// ── FST-7 DAYS ────────────────────────────────────────────────────────────────
const FST7_CHEST: Exercise[] = [
  { name: "Flat Barbell Bench Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Chest" },
  { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Decline Press", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Cable Fly (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Chest", fst7: true, notes: "Maximum stretch at bottom, squeeze hard at top" },
];

const FST7_BACK: Exercise[] = [
  { name: "Deadlift", sets: 4, reps: "5", rest: "3 min", muscleGroup: "Back" },
  { name: "Weighted Pull-Up", sets: 4, reps: "6-8", rest: "2 min", muscleGroup: "Back" },
  { name: "T-Bar Row", sets: 3, reps: "10-12", rest: "2 min", muscleGroup: "Back" },
  { name: "Dumbbell Row", sets: 3, reps: "12", rest: "90 sec", muscleGroup: "Back" },
  { name: "Straight-Arm Pulldown (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Back", fst7: true, notes: "Stretch at top, squeeze lats at bottom" },
];

const FST7_SHOULDERS: Exercise[] = [
  { name: "Seated DB Overhead Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Shoulders" },
  { name: "Lateral Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Shoulders" },
  { name: "Rear Delt Fly", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "Cable Lateral Raise (FST-7)", sets: 7, reps: "15-20", rest: "30-45 sec", muscleGroup: "Shoulders", fst7: true, notes: "Slight lean away, feel full arc of movement" },
];

const FST7_ARMS: Exercise[] = [
  { name: "EZ-Bar Curl", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Biceps" },
  { name: "Incline Dumbbell Curl", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Biceps" },
  { name: "Close-Grip Bench Press", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Triceps" },
  { name: "Skullcrusher", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Triceps" },
  { name: "Cable Curl (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Biceps", fst7: true, notes: "Full supination at top of each rep" },
];

const FST7_LEGS: Exercise[] = [
  { name: "Back Squat", sets: 4, reps: "6-8", rest: "3 min", muscleGroup: "Quads", notes: "Break parallel" },
  { name: "Romanian Deadlift", sets: 3, reps: "8-10", rest: "2 min", muscleGroup: "Hamstrings" },
  { name: "Leg Press", sets: 3, reps: "12-15", rest: "90 sec", muscleGroup: "Quads" },
  { name: "Leg Curl", sets: 3, reps: "12-15", rest: "90 sec", muscleGroup: "Hamstrings" },
  { name: "Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Calves" },
  { name: "Leg Extension (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Quads", fst7: true, notes: "Hold contraction 1s at top" },
];

// ── STRENGTH (5/3/1-inspired) ─────────────────────────────────────────────────
const STRENGTH_SQUAT: Exercise[] = [
  { name: "Back Squat", sets: 3, reps: "5/3/1", rest: "4 min", muscleGroup: "Quads", notes: "Week 1: 5×, Week 2: 3×, Week 3: 1+ (AMRAP)" },
  { name: "Front Squat", sets: 5, reps: "10", rest: "2 min", muscleGroup: "Quads", notes: "Assistance — 50-60% of back squat" },
  { name: "Leg Press", sets: 5, reps: "10", rest: "2 min", muscleGroup: "Quads" },
  { name: "Leg Curl", sets: 5, reps: "10", rest: "90 sec", muscleGroup: "Hamstrings" },
  { name: "Ab Wheel / Plank", sets: 5, reps: "10-15", rest: "60 sec", muscleGroup: "Core" },
];

const STRENGTH_BENCH: Exercise[] = [
  { name: "Flat Barbell Bench Press", sets: 3, reps: "5/3/1", rest: "4 min", muscleGroup: "Chest", notes: "Week 1: 5×, Week 2: 3×, Week 3: 1+ (AMRAP)" },
  { name: "Dumbbell Bench Press", sets: 5, reps: "10", rest: "2 min", muscleGroup: "Chest" },
  { name: "Dumbbell Row", sets: 5, reps: "10", rest: "2 min", muscleGroup: "Back" },
  { name: "Face Pull", sets: 5, reps: "15", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "Tricep Pushdown", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Triceps" },
];

const STRENGTH_DEAD: Exercise[] = [
  { name: "Deadlift", sets: 3, reps: "5/3/1", rest: "5 min", muscleGroup: "Back", notes: "Week 1: 5×, Week 2: 3×, Week 3: 1+ (AMRAP)" },
  { name: "Good Morning", sets: 5, reps: "10", rest: "2 min", muscleGroup: "Hamstrings" },
  { name: "Leg Press", sets: 5, reps: "10", rest: "2 min", muscleGroup: "Quads" },
  { name: "Hanging Leg Raise", sets: 5, reps: "10-15", rest: "60 sec", muscleGroup: "Core" },
  { name: "Calf Raise", sets: 5, reps: "15", rest: "60 sec", muscleGroup: "Calves" },
];

const STRENGTH_OHP: Exercise[] = [
  { name: "Overhead Press", sets: 3, reps: "5/3/1", rest: "4 min", muscleGroup: "Shoulders", notes: "Week 1: 5×, Week 2: 3×, Week 3: 1+ (AMRAP)" },
  { name: "Dumbbell Overhead Press", sets: 5, reps: "10", rest: "2 min", muscleGroup: "Shoulders" },
  { name: "Chin-Up", sets: 5, reps: "10", rest: "2 min", muscleGroup: "Back" },
  { name: "Lateral Raise", sets: 3, reps: "15-20", rest: "45 sec", muscleGroup: "Shoulders" },
  { name: "Barbell Curl", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Biceps" },
];

// ── BEGINNER FULL BODY ────────────────────────────────────────────────────────
const BEGINNER_A: Exercise[] = [
  { name: "Squat", sets: 3, reps: "5", rest: "2 min", muscleGroup: "Quads", notes: "Add 2.5kg every session" },
  { name: "Bench Press", sets: 3, reps: "5", rest: "2 min", muscleGroup: "Chest" },
  { name: "Barbell Row", sets: 3, reps: "5", rest: "2 min", muscleGroup: "Back" },
];

const BEGINNER_B: Exercise[] = [
  { name: "Squat", sets: 3, reps: "5", rest: "2 min", muscleGroup: "Quads", notes: "Add 2.5kg every session" },
  { name: "Overhead Press", sets: 3, reps: "5", rest: "2 min", muscleGroup: "Shoulders" },
  { name: "Deadlift", sets: 1, reps: "5", rest: "3 min", muscleGroup: "Back" },
];

// ── FEMALE-FOCUSED DAYS ───────────────────────────────────────────────────────
const FEMALE_LOWER_A: Exercise[] = [
  { name: "Hip Thrust", sets: 4, reps: "12-15", rest: "90 sec", muscleGroup: "Glutes", notes: "Drive through heels, squeeze at top" },
  { name: "Romanian Deadlift", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Hamstrings" },
  { name: "Leg Press (Feet High)", sets: 3, reps: "12-15", rest: "90 sec", muscleGroup: "Glutes" },
  { name: "Walking Lunge", sets: 3, reps: "12 each", rest: "75 sec", muscleGroup: "Glutes" },
  { name: "Cable Kickback", sets: 3, reps: "15 each", rest: "60 sec", muscleGroup: "Glutes" },
  { name: "Leg Curl", sets: 3, reps: "15", rest: "60 sec", muscleGroup: "Hamstrings" },
];

const FEMALE_UPPER_A: Exercise[] = [
  { name: "Dumbbell Row", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Back" },
  { name: "Lat Pulldown", sets: 3, reps: "12-15", rest: "75 sec", muscleGroup: "Back" },
  { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Lateral Raise", sets: 4, reps: "15-20", rest: "45 sec", muscleGroup: "Shoulders", notes: "Light, feel the burn" },
  { name: "Face Pull", sets: 3, reps: "15-20", rest: "45 sec", muscleGroup: "Rear Delt" },
  { name: "Tricep Pushdown", sets: 3, reps: "15", rest: "60 sec", muscleGroup: "Triceps" },
  { name: "Dumbbell Curl", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Biceps" },
];

const FEMALE_LOWER_B: Exercise[] = [
  { name: "Back Squat", sets: 4, reps: "10-12", rest: "2 min", muscleGroup: "Quads", notes: "Sit back into it, keep chest up" },
  { name: "Bulgarian Split Squat", sets: 3, reps: "12 each", rest: "90 sec", muscleGroup: "Glutes" },
  { name: "Leg Extension", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Quads" },
  { name: "Seated Leg Curl", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Hamstrings" },
  { name: "Hip Abduction Machine", sets: 3, reps: "20", rest: "60 sec", muscleGroup: "Glutes" },
  { name: "Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Calves" },
];

const FEMALE_UPPER_B: Exercise[] = [
  { name: "Overhead Press", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Shoulders" },
  { name: "Cable Row", sets: 4, reps: "12-15", rest: "75 sec", muscleGroup: "Back" },
  { name: "Incline Dumbbell Press", sets: 3, reps: "12-15", rest: "75 sec", muscleGroup: "Chest" },
  { name: "Cable Lateral Raise", sets: 4, reps: "15-20", rest: "45 sec", muscleGroup: "Shoulders" },
  { name: "Rear Delt Fly", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "Rope Tricep Extension", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Triceps" },
  { name: "Cable Curl", sets: 3, reps: "15", rest: "60 sec", muscleGroup: "Biceps" },
];

export const PROGRAMS: Program[] = [
  {
    id: "ppl-hypertrophy",
    name: "Push / Pull / Legs",
    subtitle: "A/B Variation — 6-Day Hypertrophy Split",
    level: "Intermediate",
    weeks: 8,
    daysPerWeek: 6,
    goal: "Muscle & Size",
    tags: ["PPL", "Hypertrophy", "6 Days"],
    description:
      "Run twice per week with A/B day variation so no two sessions are identical. Push A is bench-dominant, Push B is shoulder-dominant. Maximises volume while keeping each session fresh.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Day 1", focus: "Push A", exercises: PUSH_A },
          { label: "Day 2", focus: "Pull A", exercises: PULL_A },
          { label: "Day 3", focus: "Legs A", exercises: LEGS_A },
          { label: "Day 4", focus: "Push B", exercises: PUSH_B },
          { label: "Day 5", focus: "Pull B", exercises: PULL_B },
          { label: "Day 6", focus: "Legs B", exercises: LEGS_B },
        ],
      },
    ],
  },
  {
    id: "upper-lower",
    name: "Upper / Lower Split",
    subtitle: "4-Day Strength & Hypertrophy",
    level: "Intermediate",
    weeks: 8,
    daysPerWeek: 4,
    goal: "Strength + Size",
    tags: ["Upper Lower", "PHUL", "4 Days"],
    description:
      "Upper days alternate between heavy strength work (5 reps) and hypertrophy volume (10-15 reps). Lower days do the same. Two frequency per muscle group every week.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Monday", focus: "Upper — Strength", exercises: UPPER_STRENGTH },
          { label: "Tuesday", focus: "Lower — Strength", exercises: LOWER_STRENGTH },
          { label: "Thursday", focus: "Upper — Volume", exercises: UPPER_VOLUME },
          { label: "Friday", focus: "Lower — Volume", exercises: LOWER_VOLUME },
        ],
      },
    ],
  },
  {
    id: "bro-split",
    name: "Classic Bro Split",
    subtitle: "5-Day Bodypart Split",
    level: "Intermediate",
    weeks: 10,
    daysPerWeek: 5,
    goal: "Maximum Volume",
    tags: ["Bro Split", "Volume", "5 Days"],
    description:
      "One body part per day, high volume. Chest & Back on separate days for maximum stretch and pump. Perfect if you love training each muscle in isolation with full focus.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Monday", focus: "Chest & Back", exercises: CHEST_BACK_DAY },
          { label: "Tuesday", focus: "Shoulders & Arms", exercises: SHOULDER_ARM_DAY },
          { label: "Wednesday", focus: "Legs", exercises: LEGS_COMPLETE },
          { label: "Friday", focus: "Chest & Back", exercises: CHEST_BACK_DAY },
          { label: "Saturday", focus: "Shoulders & Arms", exercises: SHOULDER_ARM_DAY },
        ],
      },
    ],
  },
  {
    id: "fst7-bro",
    name: "FST-7 Split",
    subtitle: "Fascia Stretch Training — 5 Days",
    level: "Intermediate",
    weeks: 8,
    daysPerWeek: 5,
    goal: "Muscle Fullness",
    tags: ["FST-7", "Bro Split", "Fascia"],
    description:
      "Every session ends with 7 sets of a stretch-focused isolation — the FST-7 finisher. Designed to expand the fascia surrounding each muscle for maximum fullness and detail.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Monday", focus: "Chest", exercises: FST7_CHEST },
          { label: "Tuesday", focus: "Back", exercises: FST7_BACK },
          { label: "Wednesday", focus: "Legs", exercises: FST7_LEGS },
          { label: "Thursday", focus: "Shoulders", exercises: FST7_SHOULDERS },
          { label: "Friday", focus: "Arms", exercises: FST7_ARMS },
        ],
      },
    ],
  },
  {
    id: "531-strength",
    name: "Strength Foundation",
    subtitle: "5/3/1 — 4-Day Powerlifting Base",
    level: "Advanced",
    weeks: 12,
    daysPerWeek: 4,
    goal: "Raw Strength",
    tags: ["5/3/1", "Strength", "Powerlifting"],
    description:
      "Built around the 4 big lifts — squat, bench, deadlift, overhead press. Each week cycles through 5-rep, 3-rep, and 1+ rep maxes. Proven to add weight to the bar week after week.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Monday", focus: "Squat Day", exercises: STRENGTH_SQUAT },
          { label: "Wednesday", focus: "Bench Day", exercises: STRENGTH_BENCH },
          { label: "Friday", focus: "Deadlift Day", exercises: STRENGTH_DEAD },
          { label: "Saturday", focus: "OHP Day", exercises: STRENGTH_OHP },
        ],
      },
    ],
  },
  {
    id: "glute-tone",
    name: "Glute & Tone",
    subtitle: "Female 4-Day Upper/Lower Program",
    level: "Intermediate",
    weeks: 10,
    daysPerWeek: 4,
    goal: "Glutes & Tone",
    tags: ["Female", "Glutes", "Upper Lower"],
    description:
      "4-day Upper/Lower split with heavy glute and hamstring emphasis. Two distinct lower days (hip-hinge vs quad-dominant) and two upper days to build a proportional physique.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Monday", focus: "Lower A — Hip Hinge & Glutes", exercises: FEMALE_LOWER_A },
          { label: "Tuesday", focus: "Upper A — Back & Shoulders", exercises: FEMALE_UPPER_A },
          { label: "Thursday", focus: "Lower B — Quad & Shape", exercises: FEMALE_LOWER_B },
          { label: "Friday", focus: "Upper B — Press & Detail", exercises: FEMALE_UPPER_B },
        ],
      },
    ],
  },
  {
    id: "beginner-sb",
    name: "Starting Strength",
    subtitle: "Beginner A/B Full Body — 3 Days",
    level: "Beginner",
    weeks: 12,
    daysPerWeek: 3,
    goal: "Build the Base",
    tags: ["Beginner", "Full Body", "Strength"],
    description:
      "The simplest program that works. Alternate A and B sessions. Add 2.5kg every session on every lift. Run this until you stall — most people make progress for months.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Day A", focus: "Full Body A", exercises: BEGINNER_A },
          { label: "Day B", focus: "Full Body B", exercises: BEGINNER_B },
          { label: "Day A", focus: "Full Body A (repeat)", exercises: BEGINNER_A },
        ],
      },
    ],
  },
];
