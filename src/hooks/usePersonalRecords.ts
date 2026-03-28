import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { PersonalRecord } from "../types";

export function usePersonalRecords(exerciseId?: number) {
  const db = useSQLiteContext();
  const [records, setRecords] = useState<(PersonalRecord & { exercise_name?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    if (exerciseId) {
      const rows = await db.getAllAsync<PersonalRecord>(
        `SELECT * FROM personal_records WHERE exercise_id = ? ORDER BY record_type`,
        [exerciseId]
      );
      setRecords(rows);
    } else {
      const rows = await db.getAllAsync<PersonalRecord & { exercise_name: string }>(
        `SELECT pr.*, e.name as exercise_name
         FROM personal_records pr
         JOIN exercises e ON pr.exercise_id = e.id
         ORDER BY pr.achieved_at DESC
         LIMIT 50`
      );
      setRecords(rows);
    }
    setIsLoading(false);
  }, [db, exerciseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { records, isLoading, refresh };
}

export function useRecentPRs(days: number = 7) {
  const db = useSQLiteContext();
  const [records, setRecords] = useState<(PersonalRecord & { exercise_name: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const rows = await db.getAllAsync<PersonalRecord & { exercise_name: string }>(
        `SELECT pr.*, e.name as exercise_name
         FROM personal_records pr
         JOIN exercises e ON pr.exercise_id = e.id
         WHERE pr.achieved_at >= datetime('now', ?)
         ORDER BY pr.achieved_at DESC`,
        [`-${days} days`]
      );
      setRecords(rows);
      setIsLoading(false);
    })();
  }, [db, days]);

  return { records, isLoading };
}
