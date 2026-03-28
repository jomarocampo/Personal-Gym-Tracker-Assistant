import type { SQLiteDatabase } from "expo-sqlite";
import { format, startOfWeek, endOfWeek } from "date-fns";

export async function buildSystemPrompt(
  db: SQLiteDatabase
): Promise<string> {
  const today = format(new Date(), "yyyy-MM-dd");
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

  // 1. User profile
  const settings = await db.getFirstAsync<{
    display_name: string;
    weight_unit: string;
    fitness_goal: string;
    target_calories: number | null;
    target_protein_g: number | null;
    target_workout_days: number;
  }>("SELECT display_name, weight_unit, fitness_goal, target_calories, target_protein_g, target_workout_days FROM user_settings WHERE id = 1");

  // 2. Weekly workout stats
  const weeklyStats = await db.getFirstAsync<{
    count: number;
    total_minutes: number;
  }>(
    `SELECT COUNT(*) as count, COALESCE(SUM(duration_minutes), 0) as total_minutes
     FROM workout_sessions
     WHERE started_at >= ? AND started_at <= ?`,
    [weekStart, weekEnd]
  );

  // 3. Recent PRs
  const recentPRs = await db.getAllAsync<{
    name: string;
    record_type: string;
    value: number;
    achieved_at: string;
  }>(
    `SELECT e.name, pr.record_type, pr.value, pr.achieved_at
     FROM personal_records pr
     JOIN exercises e ON e.id = pr.exercise_id
     ORDER BY pr.achieved_at DESC LIMIT 5`
  );

  // 4. Last 3 workouts
  const recentWorkouts = await db.getAllAsync<{
    name: string | null;
    started_at: string;
    duration_minutes: number | null;
  }>(
    `SELECT name, started_at, duration_minutes
     FROM workout_sessions
     ORDER BY started_at DESC LIMIT 3`
  );

  // 5. Today's nutrition
  const todayNutrition = await db.getFirstAsync<{
    total_cal: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
  }>(
    `SELECT COALESCE(SUM(calories), 0) as total_cal,
            COALESCE(SUM(protein_g), 0) as total_protein,
            COALESCE(SUM(carbs_g), 0) as total_carbs,
            COALESCE(SUM(fat_g), 0) as total_fat
     FROM meal_log WHERE date = ?`,
    [today]
  );

  // 6. Latest body metrics
  const bodyMetric = await db.getFirstAsync<{
    weight_kg: number | null;
    body_fat_pct: number | null;
  }>(
    `SELECT weight_kg, body_fat_pct FROM body_metrics ORDER BY date DESC LIMIT 1`
  );

  // Compose prompt
  const lines: string[] = [
    "You are GymBuddy AI, a knowledgeable and motivating fitness coach inside a workout tracker app.",
    "",
    "User Profile:",
    `- Name: ${settings?.display_name ?? "Athlete"}`,
    `- Goal: ${settings?.fitness_goal ?? "general"}`,
    `- Weight Unit: ${settings?.weight_unit ?? "kg"}`,
    `- Targets: ${settings?.target_calories ?? "not set"} kcal/day, ${settings?.target_protein_g ?? "not set"}g protein/day, ${settings?.target_workout_days ?? 4} workouts/week`,
    "",
    "This Week:",
    `- Workouts completed: ${weeklyStats?.count ?? 0}`,
    `- Total training time: ${weeklyStats?.total_minutes ?? 0} minutes`,
  ];

  if (recentPRs.length > 0) {
    lines.push("", "Recent Personal Records:");
    for (const pr of recentPRs) {
      const type = pr.record_type.replace("_", " ");
      lines.push(`- ${pr.name}: ${pr.value} (${type}, ${pr.achieved_at})`);
    }
  }

  if (recentWorkouts.length > 0) {
    lines.push("", "Last 3 Workouts:");
    for (const w of recentWorkouts) {
      lines.push(
        `- "${w.name ?? "Workout"}" on ${w.started_at.split("T")[0]} (${w.duration_minutes ?? "?"} min)`
      );
    }
  }

  if (todayNutrition) {
    lines.push(
      "",
      "Today's Nutrition:",
      `- ${todayNutrition.total_cal}/${settings?.target_calories ?? "?"} kcal`,
      `- ${todayNutrition.total_protein}/${settings?.target_protein_g ?? "?"}g protein`,
      `- ${todayNutrition.total_carbs}g carbs, ${todayNutrition.total_fat}g fat`
    );
  }

  if (bodyMetric) {
    const unit = settings?.weight_unit ?? "kg";
    const weight = bodyMetric.weight_kg
      ? unit === "lbs"
        ? (bodyMetric.weight_kg * 2.20462).toFixed(1)
        : bodyMetric.weight_kg.toFixed(1)
      : "not logged";
    lines.push(
      "",
      "Body:",
      `- Weight: ${weight} ${unit}`,
      `- Body Fat: ${bodyMetric.body_fat_pct != null ? bodyMetric.body_fat_pct + "%" : "not logged"}`
    );
  }

  lines.push(
    "",
    "Guidelines:",
    "- Give concise, actionable advice.",
    "- Reference their actual data when relevant.",
    "- Use their preferred weight unit.",
    "- Do not diagnose injuries; recommend seeing a doctor.",
    "- Be encouraging and supportive."
  );

  return lines.join("\n");
}
