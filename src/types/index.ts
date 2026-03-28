// ── Enums / Union Types ──

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "core"
  | "cardio"
  | "full_body";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight"
  | "kettlebell"
  | "bands"
  | "none";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type MealCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "pre_workout"
  | "post_workout";

export type MealTag =
  | "high_protein"
  | "low_carb"
  | "bulking"
  | "cutting"
  | "vegan"
  | "meal_prep"
  | "quick";

export type FitnessGoal =
  | "bulking"
  | "cutting"
  | "maintenance"
  | "strength"
  | "general";

export type WeightUnit = "kg" | "lbs";
export type ThemeMode = "light" | "dark" | "system";
export type RecordType = "max_weight" | "max_reps" | "max_volume";

// ── Exercise ──

export interface Exercise {
  id: number;
  name: string;
  muscle_group: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  instructions: string | null;
  is_custom: number; // 0 or 1
  created_at: string;
}

// ── Workout Session ──

export interface WorkoutSession {
  id: number;
  name: string | null;
  started_at: string;
  finished_at: string | null;
  duration_minutes: number | null;
  notes: string | null;
  created_at: string;
}

// ── Workout Set ──

export interface WorkoutSet {
  id: number;
  session_id: number;
  exercise_id: number;
  set_number: number;
  reps: number;
  weight_kg: number;
  is_warmup: number; // 0 or 1
  rest_seconds: number | null;
  rpe: number | null;
  notes: string | null;
  created_at: string;
}

// ── Workout Template ──

export interface WorkoutTemplate {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// ── Template Exercise ──

export interface TemplateExercise {
  id: number;
  template_id: number;
  exercise_id: number;
  order_index: number;
  target_sets: number;
  target_reps: string;
  target_weight_kg: number | null;
  notes: string | null;
}

// ── Meal ──

export interface Meal {
  id: number;
  name: string;
  category: MealCategory;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  ingredients: string | null; // JSON array
  instructions: string | null;
  is_custom: number;
  tags: string | null; // JSON array of MealTag
  created_at: string;
}

// ── Meal Log ──

export interface MealLogEntry {
  id: number;
  meal_id: number | null;
  custom_name: string | null;
  date: string; // YYYY-MM-DD
  meal_time: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  notes: string | null;
  created_at: string;
}

// ── Body Metrics ──

export interface BodyMetric {
  id: number;
  date: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  notes: string | null;
  created_at: string;
}

// ── User Settings ──

export interface UserSettings {
  id: number;
  display_name: string;
  weight_unit: WeightUnit;
  theme_mode: ThemeMode;
  fitness_goal: FitnessGoal;
  target_calories: number | null;
  target_protein_g: number | null;
  target_workout_days: number;
  reminder_enabled: number;
  reminder_day: string;
  reminder_hour: number;
  created_at: string;
  updated_at: string;
}

// ── Personal Records ──

export interface PersonalRecord {
  id: number;
  exercise_id: number;
  record_type: RecordType;
  value: number;
  achieved_at: string;
  session_id: number | null;
  created_at: string;
}

// ── Active Workout State (in-memory, not persisted directly) ──

export interface ActiveExercise {
  exercise: Exercise;
  sets: ActiveSet[];
  previousSets: WorkoutSet[]; // from last session for this exercise
}

export interface ActiveSet {
  id: string; // temp UUID
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  is_warmup: boolean;
  rpe: number | null;
  completed: boolean;
}

// ── Enriched types for display ──

export interface WorkoutSessionWithSets extends WorkoutSession {
  exercises: WorkoutExerciseGroup[];
  total_volume: number;
  pr_count: number;
}

export interface WorkoutExerciseGroup {
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface TemplateWithExercises extends WorkoutTemplate {
  exercises: (TemplateExercise & { exercise: Exercise })[];
}
