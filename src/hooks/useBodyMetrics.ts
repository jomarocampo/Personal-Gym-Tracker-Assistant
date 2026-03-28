import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { BodyMetric } from "../types";

export function useBodyMetrics(days: number = 30) {
  const db = useSQLiteContext();
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [latestBodyFat, setLatestBodyFat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const rows = await db.getAllAsync<BodyMetric>(
      `SELECT * FROM body_metrics
       WHERE date >= date('now', ?)
       ORDER BY date ASC`,
      [`-${days} days`]
    );
    setMetrics(rows);

    const latest = await db.getFirstAsync<BodyMetric>(
      `SELECT * FROM body_metrics WHERE weight_kg IS NOT NULL ORDER BY date DESC LIMIT 1`
    );
    setLatestWeight(latest?.weight_kg ?? null);

    const latestFat = await db.getFirstAsync<BodyMetric>(
      `SELECT * FROM body_metrics WHERE body_fat_pct IS NOT NULL ORDER BY date DESC LIMIT 1`
    );
    setLatestBodyFat(latestFat?.body_fat_pct ?? null);

    setIsLoading(false);
  }, [db, days]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logMetric = useCallback(
    async (date: string, weight_kg?: number, body_fat_pct?: number, notes?: string) => {
      await db.runAsync(
        `INSERT INTO body_metrics (date, weight_kg, body_fat_pct, notes)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(date) DO UPDATE SET
           weight_kg = COALESCE(?, weight_kg),
           body_fat_pct = COALESCE(?, body_fat_pct),
           notes = COALESCE(?, notes)`,
        [date, weight_kg ?? null, body_fat_pct ?? null, notes ?? null, weight_kg ?? null, body_fat_pct ?? null, notes ?? null]
      );
      await refresh();
    },
    [db, refresh]
  );

  return { metrics, latestWeight, latestBodyFat, isLoading, refresh, logMetric };
}
