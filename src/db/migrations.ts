import type { SQLiteDatabase } from "expo-sqlite";
import { initializeDatabase } from "./client";
import {
  CREATE_TABLES_SQL,
  CREATE_INDEXES_SQL,
  INSERT_DEFAULT_SETTINGS_SQL,
} from "./schema";
import { seedExercises, seedMeals, seedTemplates } from "./seed";

type Migration = (db: SQLiteDatabase) => Promise<void>;

const migrations: Migration[] = [
  // Version 0 -> 1: Initial schema + seed data
  async (db) => {
    await db.execAsync(CREATE_TABLES_SQL);
    await db.execAsync(CREATE_INDEXES_SQL);
    await db.execAsync(INSERT_DEFAULT_SETTINGS_SQL);
    await seedExercises(db);
    await seedMeals(db);
    await seedTemplates(db);
  },
];

export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await initializeDatabase(db);

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  const currentVersion = result?.user_version ?? 0;

  for (let i = currentVersion; i < migrations.length; i++) {
    await db.execAsync("BEGIN TRANSACTION");
    try {
      await migrations[i]!(db);
      await db.execAsync(`PRAGMA user_version = ${i + 1}`);
      await db.execAsync("COMMIT");
    } catch (error) {
      await db.execAsync("ROLLBACK");
      throw error;
    }
  }
}
