import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type {
  WorkoutTemplate,
  TemplateExercise,
  Exercise,
  TemplateWithExercises,
} from "../types";

export function useTemplates() {
  const db = useSQLiteContext();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const rows = await db.getAllAsync<WorkoutTemplate>(
      "SELECT * FROM workout_templates ORDER BY name ASC"
    );
    setTemplates(rows);
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { templates, isLoading, refresh };
}

export function useTemplateDetail(templateId: number) {
  const db = useSQLiteContext();
  const [template, setTemplate] = useState<TemplateWithExercises | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tmpl = await db.getFirstAsync<WorkoutTemplate>(
        "SELECT * FROM workout_templates WHERE id = ?",
        [templateId]
      );
      if (!tmpl) {
        setIsLoading(false);
        return;
      }

      const exercises = await db.getAllAsync<
        TemplateExercise & {
          exercise_name: string;
          muscle_group: string;
          equipment: string;
          difficulty: string;
          instructions: string | null;
          is_custom: number;
          exercise_created_at: string;
        }
      >(
        `SELECT te.*, e.name as exercise_name, e.muscle_group, e.equipment, e.difficulty, e.instructions, e.is_custom, e.created_at as exercise_created_at
         FROM template_exercises te
         JOIN exercises e ON te.exercise_id = e.id
         WHERE te.template_id = ?
         ORDER BY te.order_index ASC`,
        [templateId]
      );

      setTemplate({
        ...tmpl,
        exercises: exercises.map((row) => ({
          ...row,
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
        })),
      });
      setIsLoading(false);
    })();
  }, [db, templateId]);

  return { template, isLoading };
}
