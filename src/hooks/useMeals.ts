import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { Meal, MealLogEntry, MealCategory, MealTag } from "../types";

interface MealFilters {
  search?: string;
  category?: MealCategory;
  tag?: MealTag;
}

export function useMeals(filters?: MealFilters) {
  const db = useSQLiteContext();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters?.search) {
      conditions.push("name LIKE ?");
      params.push(`%${filters.search}%`);
    }
    if (filters?.category) {
      conditions.push("category = ?");
      params.push(filters.category);
    }
    if (filters?.tag) {
      conditions.push("tags LIKE ?");
      params.push(`%${filters.tag}%`);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = await db.getAllAsync<Meal>(
      `SELECT * FROM meals ${where} ORDER BY name ASC`,
      params
    );
    setMeals(rows);
    setIsLoading(false);
  }, [db, filters?.search, filters?.category, filters?.tag]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createMeal = useCallback(
    async (meal: Omit<Meal, "id" | "is_custom" | "created_at">) => {
      await db.runAsync(
        `INSERT INTO meals (name, category, calories, protein_g, carbs_g, fat_g, fiber_g, ingredients, instructions, is_custom, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
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
      await refresh();
    },
    [db, refresh]
  );

  return { meals, isLoading, refresh, createMeal };
}

export function useMealLog(date: string) {
  const db = useSQLiteContext();
  const [entries, setEntries] = useState<(MealLogEntry & { meal_name: string | null })[]>([]);
  const [totals, setTotals] = useState({
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const rows = await db.getAllAsync<MealLogEntry & { meal_name: string | null }>(
      `SELECT ml.*, m.name as meal_name
       FROM meal_log ml
       LEFT JOIN meals m ON ml.meal_id = m.id
       WHERE ml.date = ?
       ORDER BY ml.created_at ASC`,
      [date]
    );
    setEntries(rows);

    const sum = rows.reduce(
      (acc, r) => ({
        calories: acc.calories + (r.calories ?? 0),
        protein_g: acc.protein_g + (r.protein_g ?? 0),
        carbs_g: acc.carbs_g + (r.carbs_g ?? 0),
        fat_g: acc.fat_g + (r.fat_g ?? 0),
      }),
      { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
    );
    setTotals(sum);
    setIsLoading(false);
  }, [db, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logMeal = useCallback(
    async (entry: {
      meal_id?: number;
      custom_name?: string;
      meal_time: string;
      calories?: number;
      protein_g?: number;
      carbs_g?: number;
      fat_g?: number;
      notes?: string;
    }) => {
      await db.runAsync(
        `INSERT INTO meal_log (meal_id, custom_name, date, meal_time, calories, protein_g, carbs_g, fat_g, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.meal_id ?? null,
          entry.custom_name ?? null,
          date,
          entry.meal_time,
          entry.calories ?? null,
          entry.protein_g ?? null,
          entry.carbs_g ?? null,
          entry.fat_g ?? null,
          entry.notes ?? null,
        ]
      );
      await refresh();
    },
    [db, date, refresh]
  );

  return { entries, totals, isLoading, refresh, logMeal };
}
