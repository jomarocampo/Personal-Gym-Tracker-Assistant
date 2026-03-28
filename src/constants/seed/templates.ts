interface TemplateSeed {
  name: string;
  description: string;
}

interface TemplateExerciseSeed {
  template_index: number;
  exercise_name: string;
  order_index: number;
  target_sets: number;
  target_reps: string;
  target_weight_kg: number | null;
}

export const SEED_TEMPLATES: TemplateSeed[] = [
  {
    name: "PPL - Push Day",
    description:
      "Push-focused workout targeting chest, shoulders, and triceps. Part of the Push/Pull/Legs split.",
  },
  {
    name: "PPL - Pull Day",
    description:
      "Pull-focused workout targeting back and biceps. Part of the Push/Pull/Legs split.",
  },
  {
    name: "PPL - Leg Day",
    description:
      "Leg-focused workout targeting quads, hamstrings, glutes, and calves. Part of the Push/Pull/Legs split.",
  },
  {
    name: "Upper Body",
    description:
      "Complete upper body workout hitting chest, back, shoulders, and arms in a single session.",
  },
  {
    name: "Lower Body",
    description:
      "Complete lower body workout targeting quads, hamstrings, glutes, and calves.",
  },
  {
    name: "Full Body",
    description:
      "Balanced full body workout covering all major muscle groups in one session.",
  },
];

export const SEED_TEMPLATE_EXERCISES: TemplateExerciseSeed[] = [
  // PPL - Push Day (template_index: 0)
  { template_index: 0, exercise_name: "Bench Press", order_index: 0, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 0, exercise_name: "Incline Dumbbell Press", order_index: 1, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 0, exercise_name: "Dumbbell Fly", order_index: 2, target_sets: 3, target_reps: "12-15", target_weight_kg: null },
  { template_index: 0, exercise_name: "Overhead Press", order_index: 3, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 0, exercise_name: "Lateral Raise", order_index: 4, target_sets: 3, target_reps: "12-15", target_weight_kg: null },
  { template_index: 0, exercise_name: "Tricep Pushdown", order_index: 5, target_sets: 3, target_reps: "12-15", target_weight_kg: null },
  { template_index: 0, exercise_name: "Overhead Tricep Extension", order_index: 6, target_sets: 3, target_reps: "12-15", target_weight_kg: null },

  // PPL - Pull Day (template_index: 1)
  { template_index: 1, exercise_name: "Deadlift", order_index: 0, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 1, exercise_name: "Barbell Row", order_index: 1, target_sets: 4, target_reps: "8-12", target_weight_kg: null },
  { template_index: 1, exercise_name: "Pull-ups", order_index: 2, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 1, exercise_name: "Lat Pulldown", order_index: 3, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 1, exercise_name: "Face Pulls", order_index: 4, target_sets: 3, target_reps: "12-15", target_weight_kg: null },
  { template_index: 1, exercise_name: "Barbell Curl", order_index: 5, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 1, exercise_name: "Hammer Curl", order_index: 6, target_sets: 3, target_reps: "12-15", target_weight_kg: null },

  // PPL - Leg Day (template_index: 2)
  { template_index: 2, exercise_name: "Squat", order_index: 0, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 2, exercise_name: "Leg Press", order_index: 1, target_sets: 4, target_reps: "8-12", target_weight_kg: null },
  { template_index: 2, exercise_name: "Romanian Deadlift", order_index: 2, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 2, exercise_name: "Leg Extension", order_index: 3, target_sets: 3, target_reps: "12-15", target_weight_kg: null },
  { template_index: 2, exercise_name: "Leg Curl", order_index: 4, target_sets: 3, target_reps: "12-15", target_weight_kg: null },
  { template_index: 2, exercise_name: "Calf Raises", order_index: 5, target_sets: 4, target_reps: "12-15", target_weight_kg: null },
  { template_index: 2, exercise_name: "Hip Thrust", order_index: 6, target_sets: 3, target_reps: "8-12", target_weight_kg: null },

  // Upper Body (template_index: 3)
  { template_index: 3, exercise_name: "Bench Press", order_index: 0, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 3, exercise_name: "Barbell Row", order_index: 1, target_sets: 4, target_reps: "8-12", target_weight_kg: null },
  { template_index: 3, exercise_name: "Overhead Press", order_index: 2, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 3, exercise_name: "Pull-ups", order_index: 3, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 3, exercise_name: "Dumbbell Fly", order_index: 4, target_sets: 3, target_reps: "12-15", target_weight_kg: null },
  { template_index: 3, exercise_name: "Barbell Curl", order_index: 5, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 3, exercise_name: "Tricep Pushdown", order_index: 6, target_sets: 3, target_reps: "12-15", target_weight_kg: null },

  // Lower Body (template_index: 4)
  { template_index: 4, exercise_name: "Squat", order_index: 0, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 4, exercise_name: "Romanian Deadlift", order_index: 1, target_sets: 4, target_reps: "8-12", target_weight_kg: null },
  { template_index: 4, exercise_name: "Leg Press", order_index: 2, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 4, exercise_name: "Bulgarian Split Squat", order_index: 3, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 4, exercise_name: "Leg Curl", order_index: 4, target_sets: 3, target_reps: "12-15", target_weight_kg: null },
  { template_index: 4, exercise_name: "Calf Raises", order_index: 5, target_sets: 4, target_reps: "12-15", target_weight_kg: null },

  // Full Body (template_index: 5)
  { template_index: 5, exercise_name: "Squat", order_index: 0, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 5, exercise_name: "Bench Press", order_index: 1, target_sets: 4, target_reps: "5", target_weight_kg: null },
  { template_index: 5, exercise_name: "Barbell Row", order_index: 2, target_sets: 4, target_reps: "8-12", target_weight_kg: null },
  { template_index: 5, exercise_name: "Overhead Press", order_index: 3, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 5, exercise_name: "Barbell Curl", order_index: 4, target_sets: 3, target_reps: "8-12", target_weight_kg: null },
  { template_index: 5, exercise_name: "Plank", order_index: 5, target_sets: 3, target_reps: "30-60s", target_weight_kg: null },
];
