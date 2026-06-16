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

// FST-7 rule: last exercise per muscle group = 7 sets, 30–45s rest, pump-focused isolation

const PUSH_DAY: Exercise[] = [
  { name: "Flat Barbell Bench Press", sets: 4, reps: "6-8", rest: "3 min", muscleGroup: "Chest", notes: "Pause 1s at chest" },
  { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Seated Overhead Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Shoulders" },
  { name: "Lateral Raise", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Shoulders" },
  { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Triceps" },
  { name: "Cable Fly (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Chest", fst7: true, notes: "Full stretch at bottom, squeeze at top" },
];

const PULL_DAY: Exercise[] = [
  { name: "Barbell Row", sets: 4, reps: "6-8", rest: "3 min", muscleGroup: "Back", notes: "Control the eccentric" },
  { name: "Weighted Pull-Up", sets: 4, reps: "6-8", rest: "2 min", muscleGroup: "Back" },
  { name: "Seated Cable Row", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Back" },
  { name: "Face Pull", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "Barbell Curl", sets: 3, reps: "10-12", rest: "60 sec", muscleGroup: "Biceps" },
  { name: "Lat Pulldown (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Back", fst7: true, notes: "Full stretch overhead, pull to collarbone" },
];

const LEG_DAY: Exercise[] = [
  { name: "Back Squat", sets: 4, reps: "6-8", rest: "3 min", muscleGroup: "Quads", notes: "Break parallel" },
  { name: "Romanian Deadlift", sets: 3, reps: "8-10", rest: "2 min", muscleGroup: "Hamstrings" },
  { name: "Leg Press", sets: 3, reps: "12-15", rest: "90 sec", muscleGroup: "Quads" },
  { name: "Leg Curl", sets: 3, reps: "12-15", rest: "90 sec", muscleGroup: "Hamstrings" },
  { name: "Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Calves" },
  { name: "Leg Extension (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Quads", fst7: true, notes: "Hold contraction for 1s at top" },
];

const CHEST_DAY: Exercise[] = [
  { name: "Flat Barbell Bench Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Chest" },
  { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Decline Press", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Pec Deck / Cable Fly (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Chest", fst7: true, notes: "Maximum stretch, feel the fascia" },
];

const BACK_DAY: Exercise[] = [
  { name: "Deadlift", sets: 4, reps: "5", rest: "3 min", muscleGroup: "Back" },
  { name: "Weighted Pull-Up", sets: 4, reps: "6-8", rest: "2 min", muscleGroup: "Back" },
  { name: "T-Bar Row", sets: 3, reps: "10-12", rest: "2 min", muscleGroup: "Back" },
  { name: "Dumbbell Row", sets: 3, reps: "12", rest: "90 sec", muscleGroup: "Back" },
  { name: "Straight-Arm Pulldown (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Back", fst7: true, notes: "Stretch at top, squeeze lats at bottom" },
];

const SHOULDER_DAY: Exercise[] = [
  { name: "Seated DB Overhead Press", sets: 4, reps: "8-10", rest: "2 min", muscleGroup: "Shoulders" },
  { name: "Lateral Raise", sets: 4, reps: "15-20", rest: "60 sec", muscleGroup: "Shoulders" },
  { name: "Front Raise", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Shoulders" },
  { name: "Rear Delt Fly", sets: 3, reps: "15-20", rest: "60 sec", muscleGroup: "Rear Delt" },
  { name: "Cable Lateral Raise (FST-7)", sets: 7, reps: "15-20", rest: "30-45 sec", muscleGroup: "Shoulders", fst7: true, notes: "Slight lean away from cable, full arc" },
];

const ARM_DAY: Exercise[] = [
  { name: "EZ-Bar Curl", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Biceps" },
  { name: "Incline Dumbbell Curl", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Biceps" },
  { name: "Close-Grip Bench Press", sets: 4, reps: "10-12", rest: "90 sec", muscleGroup: "Triceps" },
  { name: "Skull Crusher", sets: 3, reps: "12-15", rest: "60 sec", muscleGroup: "Triceps" },
  { name: "Cable Curl (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Biceps", fst7: true, notes: "Full supination at top" },
];

const POWER_UPPER: Exercise[] = [
  { name: "Flat Barbell Bench Press", sets: 5, reps: "3-5", rest: "4 min", muscleGroup: "Chest", notes: "Heavy — work to top set" },
  { name: "Barbell Row", sets: 5, reps: "3-5", rest: "3 min", muscleGroup: "Back" },
  { name: "Overhead Press", sets: 3, reps: "6-8", rest: "2 min", muscleGroup: "Shoulders" },
  { name: "Weighted Pull-Up", sets: 3, reps: "6-8", rest: "2 min", muscleGroup: "Back" },
  { name: "Incline DB Press", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Chest" },
  { name: "Cable Fly (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Chest", fst7: true },
];

const POWER_LOWER: Exercise[] = [
  { name: "Back Squat", sets: 5, reps: "3-5", rest: "4 min", muscleGroup: "Quads", notes: "Work to a heavy top set of 5" },
  { name: "Romanian Deadlift", sets: 4, reps: "6-8", rest: "2 min", muscleGroup: "Hamstrings" },
  { name: "Leg Press", sets: 3, reps: "10-12", rest: "2 min", muscleGroup: "Quads" },
  { name: "Leg Curl", sets: 3, reps: "10-12", rest: "90 sec", muscleGroup: "Hamstrings" },
  { name: "Leg Extension (FST-7)", sets: 7, reps: "12-15", rest: "30-45 sec", muscleGroup: "Quads", fst7: true },
];

export const PROGRAMS: Program[] = [
  {
    id: "fst7-ppl",
    name: "FST-7 Push / Pull / Legs",
    subtitle: "6-Day Split with Fascia Stretching",
    level: "Intermediate",
    weeks: 8,
    daysPerWeek: 6,
    goal: "Muscle & Fullness",
    tags: ["FST-7", "PPL", "Hypertrophy"],
    description:
      "Push/Pull/Legs run twice per week. Each session ends with 7 pump sets to stretch the fascia and maximise muscle fullness — the core principle of FST-7.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Day 1", focus: "Push", exercises: PUSH_DAY },
          { label: "Day 2", focus: "Pull", exercises: PULL_DAY },
          { label: "Day 3", focus: "Legs", exercises: LEG_DAY },
          { label: "Day 4", focus: "Push", exercises: PUSH_DAY },
          { label: "Day 5", focus: "Pull", exercises: PULL_DAY },
          { label: "Day 6", focus: "Legs", exercises: LEG_DAY },
        ],
      },
    ],
  },
  {
    id: "fst7-bro",
    name: "FST-7 Bro Split",
    subtitle: "One Muscle Group Per Day",
    level: "Intermediate",
    weeks: 6,
    daysPerWeek: 5,
    goal: "Maximum Hypertrophy",
    tags: ["FST-7", "Bro Split", "Volume"],
    description:
      "Classic 5-day bodypart split with maximum volume per muscle. Each session finishes with 7 sets of a stretch-focused isolation — the FST-7 finishing move.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Monday", focus: "Chest", exercises: CHEST_DAY },
          { label: "Tuesday", focus: "Back", exercises: BACK_DAY },
          { label: "Wednesday", focus: "Shoulders", exercises: SHOULDER_DAY },
          { label: "Thursday", focus: "Arms", exercises: ARM_DAY },
          { label: "Friday", focus: "Legs", exercises: LEG_DAY },
        ],
      },
    ],
  },
  {
    id: "fst7-powerbuilding",
    name: "FST-7 Powerbuilding",
    subtitle: "Strength + Fascia Work",
    level: "Advanced",
    weeks: 10,
    daysPerWeek: 4,
    goal: "Strength + Size",
    tags: ["FST-7", "Powerbuilding", "Strength"],
    description:
      "Heavy compound work (3–5 rep strength sets) paired with an FST-7 finisher. Build the numbers and the size at the same time.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Day 1", focus: "Upper — Heavy", exercises: POWER_UPPER },
          { label: "Day 2", focus: "Lower — Heavy", exercises: POWER_LOWER },
          { label: "Day 3", focus: "Upper — Volume", exercises: [...CHEST_DAY, ...ARM_DAY.slice(2, 5)] },
          { label: "Day 4", focus: "Lower — Volume", exercises: LEG_DAY },
        ],
      },
    ],
  },
  {
    id: "fst7-classic",
    name: "FST-7 Classic Physique",
    subtitle: "Symmetry-Focused 5-Day Split",
    level: "Advanced",
    weeks: 12,
    daysPerWeek: 5,
    goal: "Symmetry & Conditioning",
    tags: ["FST-7", "Classic Physique", "Advanced"],
    description:
      "12-week program built around proportions — wide back, full chest, capped shoulders, swept quads. Every session ends with FST-7 on the target muscle.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          { label: "Day 1", focus: "Chest & Triceps", exercises: [...CHEST_DAY, ...ARM_DAY.slice(2, 4)] },
          { label: "Day 2", focus: "Back & Biceps", exercises: [...BACK_DAY, ...ARM_DAY.slice(0, 2)] },
          { label: "Day 3", focus: "Legs", exercises: LEG_DAY },
          { label: "Day 4", focus: "Shoulders", exercises: SHOULDER_DAY },
          { label: "Day 5", focus: "Arms", exercises: ARM_DAY },
        ],
      },
    ],
  },
  {
    id: "fst7-beginner",
    name: "FST-7 Foundation",
    subtitle: "Introduction to Fascia Training",
    level: "Beginner",
    weeks: 6,
    daysPerWeek: 3,
    goal: "Build the Base",
    tags: ["FST-7", "Beginner", "Full Body"],
    description:
      "Three full-body sessions introducing the FST-7 concept. One finishing pump set per session so beginners feel the principle before advancing to full splits.",
    schedule: [
      {
        weekNumber: 1,
        days: [
          {
            label: "Day A", focus: "Full Body A", exercises: [
              { name: "Squat", sets: 3, reps: "8", rest: "2 min", muscleGroup: "Quads" },
              { name: "Bench Press", sets: 3, reps: "8", rest: "2 min", muscleGroup: "Chest" },
              { name: "Barbell Row", sets: 3, reps: "8", rest: "2 min", muscleGroup: "Back" },
              { name: "Overhead Press", sets: 3, reps: "8", rest: "90 sec", muscleGroup: "Shoulders" },
              { name: "Cable Fly (FST-7 intro)", sets: 7, reps: "15", rest: "30-45 sec", muscleGroup: "Chest", fst7: true, notes: "Light weight — focus on the stretch" },
            ],
          },
          {
            label: "Day B", focus: "Full Body B", exercises: [
              { name: "Deadlift", sets: 3, reps: "5", rest: "3 min", muscleGroup: "Back" },
              { name: "Incline DB Press", sets: 3, reps: "10", rest: "90 sec", muscleGroup: "Chest" },
              { name: "Lat Pulldown", sets: 3, reps: "10", rest: "90 sec", muscleGroup: "Back" },
              { name: "Leg Press", sets: 3, reps: "12", rest: "90 sec", muscleGroup: "Quads" },
              { name: "Straight-Arm Pulldown (FST-7 intro)", sets: 7, reps: "15", rest: "30-45 sec", muscleGroup: "Back", fst7: true, notes: "Light weight — feel the lat stretch" },
            ],
          },
          {
            label: "Day C", focus: "Full Body C", exercises: [
              { name: "Front Squat", sets: 3, reps: "8", rest: "2 min", muscleGroup: "Quads" },
              { name: "Dumbbell Press", sets: 3, reps: "10", rest: "90 sec", muscleGroup: "Chest" },
              { name: "Cable Row", sets: 3, reps: "12", rest: "90 sec", muscleGroup: "Back" },
              { name: "Romanian Deadlift", sets: 3, reps: "10", rest: "90 sec", muscleGroup: "Hamstrings" },
              { name: "Leg Extension (FST-7 intro)", sets: 7, reps: "15", rest: "30-45 sec", muscleGroup: "Quads", fst7: true },
            ],
          },
        ],
      },
    ],
  },
];
