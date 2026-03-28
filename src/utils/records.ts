import type { SQLiteDatabase } from "expo-sqlite";
import type { RecordType, WorkoutSet } from "../types";

interface PRResult {
  type: RecordType;
  oldValue: number | null;
  newValue: number;
}

export async function detectAndSavePRs(
  db: SQLiteDatabase,
  exerciseId: number,
  sessionId: number,
  sets: WorkoutSet[]
): Promise<PRResult[]> {
  const prs: PRResult[] = [];
  const workingSets = sets.filter((s) => !s.is_warmup);

  if (workingSets.length === 0) return prs;

  // Max weight
  const maxWeight = Math.max(...workingSets.map((s) => s.weight_kg));
  if (maxWeight > 0) {
    const existing = await db.getFirstAsync<{ value: number }>(
      `SELECT value FROM personal_records WHERE exercise_id = ? AND record_type = 'max_weight'`,
      [exerciseId]
    );
    if (!existing || maxWeight > existing.value) {
      await db.runAsync(
        `INSERT INTO personal_records (exercise_id, record_type, value, achieved_at, session_id)
         VALUES (?, 'max_weight', ?, datetime('now'), ?)
         ON CONFLICT(exercise_id, record_type) DO UPDATE SET value = ?, achieved_at = datetime('now'), session_id = ?`,
        [exerciseId, maxWeight, sessionId, maxWeight, sessionId]
      );
      prs.push({
        type: "max_weight",
        oldValue: existing?.value ?? null,
        newValue: maxWeight,
      });
    }
  }

  // Max reps (at any weight)
  const maxReps = Math.max(...workingSets.map((s) => s.reps));
  if (maxReps > 0) {
    const existing = await db.getFirstAsync<{ value: number }>(
      `SELECT value FROM personal_records WHERE exercise_id = ? AND record_type = 'max_reps'`,
      [exerciseId]
    );
    if (!existing || maxReps > existing.value) {
      await db.runAsync(
        `INSERT INTO personal_records (exercise_id, record_type, value, achieved_at, session_id)
         VALUES (?, 'max_reps', ?, datetime('now'), ?)
         ON CONFLICT(exercise_id, record_type) DO UPDATE SET value = ?, achieved_at = datetime('now'), session_id = ?`,
        [exerciseId, maxReps, sessionId, maxReps, sessionId]
      );
      prs.push({
        type: "max_reps",
        oldValue: existing?.value ?? null,
        newValue: maxReps,
      });
    }
  }

  // Max volume (total weight × reps for this exercise in one session)
  const totalVolume = workingSets.reduce(
    (sum, s) => sum + s.weight_kg * s.reps,
    0
  );
  if (totalVolume > 0) {
    const existing = await db.getFirstAsync<{ value: number }>(
      `SELECT value FROM personal_records WHERE exercise_id = ? AND record_type = 'max_volume'`,
      [exerciseId]
    );
    if (!existing || totalVolume > existing.value) {
      await db.runAsync(
        `INSERT INTO personal_records (exercise_id, record_type, value, achieved_at, session_id)
         VALUES (?, 'max_volume', ?, datetime('now'), ?)
         ON CONFLICT(exercise_id, record_type) DO UPDATE SET value = ?, achieved_at = datetime('now'), session_id = ?`,
        [exerciseId, totalVolume, sessionId, totalVolume, sessionId]
      );
      prs.push({
        type: "max_volume",
        oldValue: existing?.value ?? null,
        newValue: totalVolume,
      });
    }
  }

  return prs;
}
