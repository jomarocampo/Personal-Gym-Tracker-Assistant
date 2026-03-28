import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type {
  WorkoutSession,
  WorkoutSet,
  Exercise,
  WorkoutSessionWithSets,
  WorkoutExerciseGroup,
} from "../types";

export function useWorkoutHistory(limit: number = 20) {
  const db = useSQLiteContext();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const rows = await db.getAllAsync<WorkoutSession>(
      `SELECT * FROM workout_sessions
       WHERE finished_at IS NOT NULL
       ORDER BY started_at DESC
       LIMIT ?`,
      [limit]
    );
    setSessions(rows);
    setIsLoading(false);
  }, [db, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { sessions, isLoading, refresh };
}

export function useWorkoutDetail(sessionId: number) {
  const db = useSQLiteContext();
  const [workout, setWorkout] = useState<WorkoutSessionWithSets | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await db.getFirstAsync<WorkoutSession>(
        "SELECT * FROM workout_sessions WHERE id = ?",
        [sessionId]
      );
      if (!session) {
        setIsLoading(false);
        return;
      }

      const sets = await db.getAllAsync<WorkoutSet & { exercise_name: string; muscle_group: string; equipment: string; difficulty: string; instructions: string | null; is_custom: number; exercise_created_at: string }>(
        `SELECT ws.*, e.name as exercise_name, e.muscle_group, e.equipment, e.difficulty, e.instructions, e.is_custom, e.created_at as exercise_created_at
         FROM workout_sets ws
         JOIN exercises e ON ws.exercise_id = e.id
         WHERE ws.session_id = ?
         ORDER BY ws.exercise_id, ws.set_number`,
        [sessionId]
      );

      const exerciseMap = new Map<number, WorkoutExerciseGroup>();
      let totalVolume = 0;

      for (const row of sets) {
        if (!exerciseMap.has(row.exercise_id)) {
          exerciseMap.set(row.exercise_id, {
            exercise: {
              id: row.exercise_id,
              name: row.exercise_name,
              muscle_group: row.muscle_group as Exercise["muscle_group"],
              equipment: row.equipment as Exercise["equipment"],
              difficulty: row.difficulty as Exercise["difficulty"],
              instructions: row.instructions,
              is_custom: row.is_custom,
              created_at: row.exercise_created_at,
            },
            sets: [],
          });
        }
        const group = exerciseMap.get(row.exercise_id)!;
        group.sets.push(row);
        if (!row.is_warmup) {
          totalVolume += row.weight_kg * row.reps;
        }
      }

      // Count PRs
      const prCount = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM personal_records WHERE session_id = ?`,
        [sessionId]
      );

      setWorkout({
        ...session,
        exercises: Array.from(exerciseMap.values()),
        total_volume: totalVolume,
        pr_count: prCount?.count ?? 0,
      });
      setIsLoading(false);
    })();
  }, [db, sessionId]);

  return { workout, isLoading };
}

export function useWeeklyStats() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState({
    workoutCount: 0,
    totalMinutes: 0,
    totalVolume: 0,
    prCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartISO = weekStart.toISOString();

    const sessionStats = await db.getFirstAsync<{
      count: number;
      total_minutes: number;
    }>(
      `SELECT COUNT(*) as count, COALESCE(SUM(duration_minutes), 0) as total_minutes
       FROM workout_sessions
       WHERE finished_at IS NOT NULL AND started_at >= ?`,
      [weekStartISO]
    );

    const volumeResult = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(ws.weight_kg * ws.reps), 0) as total
       FROM workout_sets ws
       JOIN workout_sessions s ON ws.session_id = s.id
       WHERE s.finished_at IS NOT NULL AND s.started_at >= ? AND ws.is_warmup = 0`,
      [weekStartISO]
    );

    const prResult = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM personal_records WHERE achieved_at >= ?`,
      [weekStartISO]
    );

    setStats({
      workoutCount: sessionStats?.count ?? 0,
      totalMinutes: sessionStats?.total_minutes ?? 0,
      totalVolume: volumeResult?.total ?? 0,
      prCount: prResult?.count ?? 0,
    });
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, isLoading, refresh };
}
