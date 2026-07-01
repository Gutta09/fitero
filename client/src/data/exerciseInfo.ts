export type ExerciseInfo = {
  muscles: string[];
  secondary?: string[];
  cues: string[];
  mistakes: string[];
  alternatives?: string[];
};

export const EXERCISE_INFO: Record<string, ExerciseInfo> = {
  "Flat Barbell Bench Press": {
    muscles: ["Chest (Pectoralis Major)"],
    secondary: ["Front Delt", "Triceps"],
    cues: [
      "Retract and depress your shoulder blades — create a stable base on the bench",
      "Grip slightly wider than shoulder-width, wrists straight above elbows",
      "Lower the bar to your lower chest/nipple line, not your neck",
      "Pause 1 second at the chest — eliminates bounce and builds true strength",
      "Drive feet into the floor and press the bar back and slightly towards your face",
    ],
    mistakes: [
      "Flaring elbows out to 90° — tuck them to 45–75° to protect your shoulders",
      "Bouncing the bar off the chest — reduces tension and risks injury",
      "Losing the arch in your upper back — keep shoulder blades pinched throughout",
    ],
    alternatives: ["Dumbbell Bench Press", "Push-Up", "Cable Fly"],
  },
  "Incline Dumbbell Press": {
    muscles: ["Upper Chest (Clavicular Head)"],
    secondary: ["Front Delt", "Triceps"],
    cues: [
      "Set bench to 30–45° — higher angles shift load to shoulders, not chest",
      "Hold dumbbells at shoulder width, neutral grip or slight pronation",
      "Lower until upper arm is parallel to the floor — full stretch",
      "Press up and slightly inward, squeezing the chest at the top",
    ],
    mistakes: [
      "Bench angle too high (60°+) — becomes a shoulder press, not chest",
      "Dumbbells too wide at the top — keep them close together to maintain tension",
    ],
    alternatives: ["Incline Barbell Press", "Cable Incline Fly", "Machine Chest Press"],
  },
  "Seated Overhead Press": {
    muscles: ["Shoulders (Anterior & Medial Delt)"],
    secondary: ["Triceps", "Upper Traps"],
    cues: [
      "Sit upright, lower back supported, feet flat on the floor",
      "Grip just outside shoulder width — bar rests on upper chest/front delt",
      "Press straight up, lock out overhead with ears between your arms",
      "Lower under control — don't let the bar crash down",
    ],
    mistakes: [
      "Excessive lower back arch — seat should support your back",
      "Bar path forward instead of straight up — press in a vertical line",
    ],
    alternatives: ["Dumbbell Overhead Press", "Arnold Press", "Machine Shoulder Press"],
  },
  "Lateral Raise": {
    muscles: ["Shoulders (Medial/Side Delt)"],
    secondary: ["Supraspinatus", "Upper Traps"],
    cues: [
      "Slight forward lean (10–15°) — puts the medial delt on stretch",
      "Lead with your elbows, not your hands — arms form a T at the top",
      "Tilt dumbbells slightly down (pinky higher) to target side delt, not front delt",
      "Go no higher than parallel to the floor — above that is traps",
      "Lower slowly (3 seconds) — the eccentric builds the most size here",
    ],
    mistakes: [
      "Using too much weight and swinging — side delts are a small muscle, go lighter",
      "Shrugging at the top — keep traps relaxed throughout",
    ],
    alternatives: ["Cable Lateral Raise", "Machine Lateral Raise", "Face-away Cable Raise"],
  },
  "Tricep Pushdown": {
    muscles: ["Triceps (Lateral Head)"],
    secondary: ["Medial Head"],
    cues: [
      "Elbows locked at your sides — they should not move during the rep",
      "Start with forearms parallel to floor, press down to full lockout",
      "Squeeze the tricep hard at the bottom for 1 second",
      "Control the return — don't let the weight pull your elbows forward",
    ],
    mistakes: [
      "Elbows flying forward — pin them to your sides",
      "Only doing half reps — full extension is where the tricep fully contracts",
    ],
    alternatives: ["Skullcrusher", "Overhead Tricep Extension", "Dips"],
  },
  "Skullcrusher": {
    muscles: ["Triceps (Long Head)"],
    secondary: ["Lateral Head", "Medial Head"],
    cues: [
      "Lie flat, arms extended straight up, elbows shoulder-width apart",
      "Lower the bar to your forehead (or just above) by bending only the elbows",
      "Elbows point straight up — don't let them flare out",
      "Press back to full lockout, squeezing triceps at the top",
    ],
    mistakes: [
      "Letting elbows drift back — keep them pointing straight at the ceiling",
      "Going too heavy — this is a finesse movement, control matters more than load",
    ],
    alternatives: ["Tricep Pushdown", "Cable Overhead Extension", "Dumbbell Kickback"],
  },
  "Barbell Row": {
    muscles: ["Back (Lats, Rhomboids, Mid-Traps)"],
    secondary: ["Rear Delt", "Biceps"],
    cues: [
      "Hinge at the hips until torso is 45° or close to parallel with the floor",
      "Grip just outside shoulder width, underhand or overhand",
      "Pull the bar to your lower stomach — not your chest",
      "Lead with your elbows, drive them back past your torso",
      "Control the eccentric — lower the bar slowly, feel the lats stretch",
    ],
    mistakes: [
      "Jerking with the lower back — the row should come from pulling your elbows back",
      "Pulling to the chest — shifts load to biceps and rear delt, away from lats",
      "Standing too upright — get the torso angled to engage the back properly",
    ],
    alternatives: ["T-Bar Row", "Seated Cable Row", "Single-Arm Dumbbell Row"],
  },
  "Weighted Pull-Up": {
    muscles: ["Lats", "Rhomboids", "Mid-Traps"],
    secondary: ["Biceps", "Rear Delt"],
    cues: [
      "Hang with arms fully extended — full dead hang before every rep",
      "Pull from your elbows, not your hands — think 'elbows to hips'",
      "Get your chin cleanly above the bar, chest to bar if possible",
      "Lower slowly — the eccentric builds the most back width",
    ],
    mistakes: [
      "Kipping — swinging takes tension off the back",
      "Half reps — partial range means partial development",
    ],
    alternatives: ["Lat Pulldown", "Assisted Pull-Up", "Band Pull-Up"],
  },
  "Lat Pulldown": {
    muscles: ["Lats (Latissimus Dorsi)"],
    secondary: ["Biceps", "Rear Delt", "Rhomboids"],
    cues: [
      "Lean back slightly (15°), chest up, eyes forward",
      "Pull the bar to your collarbone — not behind your neck",
      "Drive elbows down and in, as if putting them in your back pockets",
      "Pause at the bottom for 1 second — feel the lats fully contracted",
      "Allow a full stretch at the top — arms straight overhead each rep",
    ],
    mistakes: [
      "Pulling behind the neck — serious risk of cervical spine injury",
      "Leaning back too far (45°+) — becomes a rowing movement",
    ],
    alternatives: ["Pull-Up", "Straight-Arm Pulldown", "Cable Row"],
  },
  "Seated Cable Row": {
    muscles: ["Mid-Back (Rhomboids, Mid-Traps)"],
    secondary: ["Lats", "Rear Delt", "Biceps"],
    cues: [
      "Sit tall, feet braced, slight natural arch in your lower back",
      "Pull the handle to your lower stomach, elbows tight to your sides",
      "Squeeze shoulder blades together at the end of each rep",
      "Lean forward slightly on the stretch — feel the thoracic spine open",
    ],
    mistakes: [
      "Using momentum/rocking — control the movement from your back, not your torso",
      "Not getting a full stretch — let the cable pull your arms forward each rep",
    ],
    alternatives: ["Barbell Row", "Dumbbell Row", "Machine Row"],
  },
  "Face Pull": {
    muscles: ["Rear Delt", "External Rotators"],
    secondary: ["Mid-Traps", "Rhomboids"],
    cues: [
      "Set cable at face height or above, use a rope attachment",
      "Pull the rope to your face, separating hands at the end — 'double bicep' finish",
      "Keep elbows above the rope path — elbow flare is the key",
      "Pause at the face with full external rotation for 1 second",
    ],
    mistakes: [
      "Pulling to the neck instead of the face",
      "Elbows dropping below the rope — loses rear delt and external rotator emphasis",
    ],
    alternatives: ["Rear Delt Fly", "Band Pull-Apart", "YTW raises"],
  },
  "Barbell Curl": {
    muscles: ["Biceps (Long & Short Head)"],
    secondary: ["Brachialis", "Brachioradialis"],
    cues: [
      "Elbows fixed at your sides — they should not move forward",
      "Supinate (rotate) your wrists as you curl — turns to palms-up at the top",
      "Full range: start with arms straight, curl until forearms touch biceps",
      "Lower slowly (3 seconds) — the negative builds more muscle than the lift",
    ],
    mistakes: [
      "Swinging the body — reduces tension on the bicep and risks lower back strain",
      "Elbows drifting forward at the top — the bicep is most contracted when elbows are back",
    ],
    alternatives: ["EZ-Bar Curl", "Dumbbell Curl", "Cable Curl"],
  },
  "Back Squat": {
    muscles: ["Quads (Rectus Femoris, Vastus Lateralis/Medialis)"],
    secondary: ["Glutes", "Hamstrings", "Core"],
    cues: [
      "Bar sits on your upper traps (high bar) or rear delts (low bar) — not your neck",
      "Feet shoulder-width, toes 15–30° out based on your hip structure",
      "Break at the hips AND knees simultaneously — don't sit straight down",
      "Keep knees tracking in line with toes throughout the descent",
      "Break parallel — hip crease below the top of your knee",
      "Drive the floor away, keep chest up on the ascent",
    ],
    mistakes: [
      "Knees caving inward (valgus) on the way up — cue: 'spread the floor'",
      "Forward lean excessive — usually a mobility issue, work on ankle/hip flexibility",
      "Not reaching depth — partial squats miss the glutes and hamstrings entirely",
    ],
    alternatives: ["Goblet Squat", "Leg Press", "Bulgarian Split Squat", "Front Squat"],
  },
  "Romanian Deadlift": {
    muscles: ["Hamstrings", "Glutes"],
    secondary: ["Lower Back (Erectors)", "Adductors"],
    cues: [
      "Start standing, push hips back (not down) — like closing a car door with your butt",
      "Bar stays close to the body, dragging down your thighs",
      "Lower until you feel a deep hamstring stretch — usually mid-shin or floor",
      "Drive hips forward to return to standing — squeeze glutes at the top",
      "Soft bend in knees throughout — this is NOT a squat",
    ],
    mistakes: [
      "Bending knees too much — turns it into a deadlift",
      "Rounding the lower back — keep a neutral spine, hinge from the hip",
      "Bar drifting away from the body — keep it dragging close to the legs",
    ],
    alternatives: ["Stiff-Leg Deadlift", "Leg Curl", "Nordic Curl", "Glute-Ham Raise"],
  },
  "Leg Press": {
    muscles: ["Quads", "Glutes"],
    secondary: ["Hamstrings", "Adductors"],
    cues: [
      "Foot placement changes emphasis — high feet = more glutes/hams, low feet = more quads",
      "Lower until knees are at 90° or hips start to tilt off the pad",
      "Don't lock out completely at the top — keep tension on the quads",
      "Press evenly through the full foot — don't rise onto your toes",
    ],
    mistakes: [
      "Hips lifting off the pad at the bottom — reduce weight or raise foot position",
      "Full lockout with knees — risks knee joint hyperextension",
    ],
    alternatives: ["Back Squat", "Hack Squat", "Leg Extension"],
  },
  "Hip Thrust": {
    muscles: ["Glutes (Gluteus Maximus)"],
    secondary: ["Hamstrings", "Hip Adductors"],
    cues: [
      "Upper back rests on the bench edge — just below your shoulder blades",
      "Feet hip-width, flat on the floor, 90° knee angle at the top",
      "Drive through your heels, squeeze glutes hard at full extension",
      "Hold for 2 seconds at the top — the peak contraction builds the most glute size",
      "Don't hyperextend your lower back — neutral spine at the top",
    ],
    mistakes: [
      "Driving through your toes — shifts load off glutes to quads",
      "Not reaching full hip extension — stop short and you miss the peak contraction",
    ],
    alternatives: ["Glute Bridge", "Cable Kickback", "Romanian Deadlift"],
  },
  "Leg Extension": {
    muscles: ["Quads (Rectus Femoris, Vastus Medialis)"],
    cues: [
      "Adjust pad so it sits just above the ankle, not the shin",
      "Sit upright — don't lean back, which uses hip flexors",
      "Extend to full lockout and hold 1 second — fully contracts the quads",
      "Lower slowly (3 seconds) — the eccentric tears muscle fibres for growth",
    ],
    mistakes: [
      "Swinging/momentum — use controlled, slow reps",
      "Not locking out — full extension is where the rectus femoris contracts",
    ],
    alternatives: ["Back Squat", "Hack Squat", "Leg Press"],
  },
  "Leg Curl": {
    muscles: ["Hamstrings (Biceps Femoris)"],
    cues: [
      "Lie flat, pad just above the ankle, hips pressed into the bench",
      "Curl to full flexion — heel to glute",
      "Squeeze at the top for 1 second, lower over 3 seconds",
      "Don't let hips rise off the bench — isolates the hamstring",
    ],
    mistakes: [
      "Hips rising — means you're using lower back to assist",
      "Partial reps — full range produces more hypertrophy",
    ],
    alternatives: ["Romanian Deadlift", "Nordic Curl", "Good Morning"],
  },
  "Deadlift": {
    muscles: ["Entire Posterior Chain — Glutes, Hamstrings, Lower & Upper Back"],
    secondary: ["Quads", "Core", "Traps", "Forearms"],
    cues: [
      "Bar over mid-foot (about 1 inch from shins), stance hip-width",
      "Hip hinge to reach the bar — push hips back, don't squat down to it",
      "Squeeze the bar hard, take a big breath into your belly (brace 360°)",
      "Push the floor away — it's a leg press movement, not a back pull",
      "Bar stays dragging against your shins and thighs the whole way up",
      "Lock out with glutes squeezed — don't hyperextend at the top",
    ],
    mistakes: [
      "Bar drifting forward — makes leverage terrible, destroys your lower back",
      "Jerking the bar — create tension first, then smoothly apply force",
      "Rounding the lower back under load — build to heavier weights gradually",
    ],
    alternatives: ["Romanian Deadlift", "Trap Bar Deadlift", "Good Morning"],
  },
  "Overhead Press": {
    muscles: ["Shoulders (Anterior & Medial Delt)"],
    secondary: ["Triceps", "Upper Traps", "Serratus Anterior"],
    cues: [
      "Bar rests on your upper chest/front delt — not too far down",
      "Grip slightly wider than shoulder width, elbows slightly in front of the bar",
      "Brace your core — this is a full-body tension movement",
      "Press the bar straight up, leaning slightly back to let it clear your face",
      "Shrug at the top — full shoulder elevation finishes the press",
    ],
    mistakes: [
      "Bar path forward in an arc — press straight up, not away from you",
      "Flaring elbows too wide at the start — creates impingement risk",
    ],
    alternatives: ["Dumbbell Overhead Press", "Arnold Press", "Seated DB Press"],
  },
  "Bulgarian Split Squat": {
    muscles: ["Quads", "Glutes"],
    secondary: ["Hamstrings", "Hip Flexors"],
    cues: [
      "Rear foot elevated on a bench, front foot 2–3 feet ahead",
      "Lower straight down — don't let the front knee drift far past the toe",
      "Keep your torso upright — lean forward only for more glute emphasis",
      "Drive through the front heel to stand — most of the work comes from that leg",
    ],
    mistakes: [
      "Front foot too close — causes excessive forward knee travel",
      "Front foot too far — turns into a hip flexor stretch, not a leg exercise",
    ],
    alternatives: ["Reverse Lunge", "Walking Lunge", "Back Squat"],
  },
  "Cable Lateral Raise": {
    muscles: ["Medial Delt"],
    cues: [
      "Stand side-on to the cable, handle in the hand furthest from the machine",
      "Slight lean away from the cable — puts the delt on constant tension",
      "Raise until arm is parallel to the floor, elbow leads not the hand",
      "Lower under full control — the cable provides tension throughout the range",
    ],
    mistakes: [
      "Standing straight on — dumbbell lateral raise is just as effective then",
      "Using too much weight — you should feel the burn with light weight done slowly",
    ],
    alternatives: ["Dumbbell Lateral Raise", "Machine Lateral Raise"],
  },
};

export function getExerciseInfo(name: string): ExerciseInfo | null {
  // exact match first
  if (EXERCISE_INFO[name]) return EXERCISE_INFO[name];
  // partial match — e.g. "Cable Fly (FST-7)" should match "Cable Fly"
  const key = Object.keys(EXERCISE_INFO).find((k) => name.includes(k) || k.includes(name.split("(")[0].trim()));
  return key ? EXERCISE_INFO[key] : null;
}
