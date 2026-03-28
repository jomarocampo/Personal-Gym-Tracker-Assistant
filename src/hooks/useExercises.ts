import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { Exercise, MuscleGroup, Equipment, Difficulty } from "../types";

interface ExerciseFilters {
  search?: string;
  muscle_group?: MuscleGroup;
  equipment?: Equipment;
  difficulty?: Difficulty;
}

export function useExercises(filters?: ExerciseFilters) {
  const db = useSQLiteContext();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters?.search) {
      conditions.push("name LIKE ?");
      params.push(`%${filters.search}%`);
    }
    if (filters?.muscle_group) {
      conditions.push("muscle_group = ?");
      params.push(filters.muscle_group);
    }
    if (filters?.equipment) {
      conditions.push("equipment = ?");
      params.push(filters.equipment);
    }
    if (filters?.difficulty) {
      conditions.push("difficulty = ?");
      params.push(filters.difficulty);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = await db.getAllAsync<Exercise>(
      `SELECT * FROM exercises ${where} ORDER BY name ASC`,
      params
    );
    setExercises(rows);
    setIsLoading(false);
  }, [
    db,
    filters?.search,
    filters?.muscle_group,
    filters?.equipment,
    filters?.difficulty,
  ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createExercise = useCallback(
    async (exercise: Omit<Exercise, "id" | "is_custom" | "created_at">) => {
      await db.runAsync(
        `INSERT INTO exercises (name, muscle_group, equipment, difficulty, instructions, is_custom)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [
          exercise.name,
          exercise.muscle_group,
          exercise.equipment,
          exercise.difficulty,
          exercise.instructions,
        ]
      );
      await refresh();
    },
    [db, refresh]
  );

  return { exercises, isLoading, refresh, createExercise };
}

export function useExercise(id: number) {
  const db = useSQLiteContext();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const row = await db.getFirstAsync<Exercise>(
        "SELECT * FROM exercises WHERE id = ?",
        [id]
      );
      setExercise(row ?? null);
      setIsLoading(false);
    })();
  }, [db, id]);

  return { exercise, isLoading };
}

export function useExerciseHistory(exerciseId: number) {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<
    { date: string; sets: { reps: number; weight_kg: number }[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const rows = await db.getAllAsync<{
        session_date: string;
        reps: number;
        weight_kg: number;
      }>(
        `SELECT s.started_at as session_date, ws.reps, ws.weight_kg
         FROM workout_sets ws
         JOIN workout_sessions s ON ws.session_id = s.id
         WHERE ws.exercise_id = ? AND s.finished_at IS NOT NULL AND ws.is_warmup = 0
         ORDER BY s.started_at DESC, ws.set_number ASC
         LIMIT 100`,
        [exerciseId]
      );

      const grouped = new Map<
        string,
        { reps: number; weight_kg: number }[]
      >();
      for (const row of rows) {
        const date = row.session_date.split("T")[0] ?? row.session_date;
        const existing = grouped.get(date) ?? [];
        existing.push({ reps: row.reps, weight_kg: row.weight_kg });
        grouped.set(date, existing);
      }

      setHistory(
        Array.from(grouped.entries()).map(([date, sets]) => ({ date, sets }))
      );
      setIsLoading(false);
    })();
  }, [db, exerciseId]);

  return { history, isLoading };
}
