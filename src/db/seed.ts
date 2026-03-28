import type { SQLiteDatabase } from "expo-sqlite";
import { SEED_EXERCISES } from "../constants/seed/exercises";
import { SEED_MEALS } from "../constants/seed/meals";
import {
  SEED_TEMPLATES,
  SEED_TEMPLATE_EXERCISES,
} from "../constants/seed/templates";

export async function seedExercises(db: SQLiteDatabase): Promise<void> {
  for (const exercise of SEED_EXERCISES) {
    await db.runAsync(
      `INSERT INTO exercises (name, muscle_group, equipment, difficulty, instructions, is_custom)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [
        exercise.name,
        exercise.muscle_group,
        exercise.equipment,
        exercise.difficulty,
        exercise.instructions,
      ]
    );
  }
}

export async function seedMeals(db: SQLiteDatabase): Promise<void> {
  for (const meal of SEED_MEALS) {
    await db.runAsync(
      `INSERT INTO meals (name, category, calories, protein_g, carbs_g, fat_g, fiber_g, ingredients, instructions, is_custom, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        meal.name,
        meal.category,
        meal.calories,
        meal.protein_g,
        meal.carbs_g,
        meal.fat_g,
        meal.fiber_g,
        meal.ingredients,
        meal.instructions,
        meal.tags,
      ]
    );
  }
}

export async function seedTemplates(db: SQLiteDatabase): Promise<void> {
  const templateIds: number[] = [];

  for (const template of SEED_TEMPLATES) {
    const result = await db.runAsync(
      `INSERT INTO workout_templates (name, description) VALUES (?, ?)`,
      [template.name, template.description]
    );
    templateIds.push(result.lastInsertRowId);
  }

  for (const te of SEED_TEMPLATE_EXERCISES) {
    const templateId = templateIds[te.template_index];
    if (templateId === undefined) continue;

    // Look up exercise ID by name
    const exercise = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM exercises WHERE name = ?`,
      [te.exercise_name]
    );
    if (!exercise) continue;

    await db.runAsync(
      `INSERT INTO template_exercises (template_id, exercise_id, order_index, target_sets, target_reps, target_weight_kg, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        templateId,
        exercise.id,
        te.order_index,
        te.target_sets,
        te.target_reps,
        te.target_weight_kg,
        null,
      ]
    );
  }
}
