import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  type PropsWithChildren,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
import * as Haptics from "expo-haptics";
import uuid from "react-native-uuid";
import type {
  Exercise,
  ActiveExercise,
  ActiveSet,
  WorkoutSet,
  RecordType,
} from "../types";
import { detectAndSavePRs } from "../utils/records";
import { nowISO, getDurationMinutes } from "../utils/dates";

// ── State ──

interface WorkoutState {
  isActive: boolean;
  sessionName: string;
  startedAt: string | null;
  exercises: ActiveExercise[];
  restTimer: { remaining: number; total: number } | null;
  newPRs: { exerciseId: number; exerciseName: string; type: RecordType }[];
}

const initialState: WorkoutState = {
  isActive: false,
  sessionName: "",
  startedAt: null,
  exercises: [],
  restTimer: null,
  newPRs: [],
};

// ── Actions ──

type WorkoutAction =
  | { type: "START_WORKOUT"; name: string }
  | { type: "ADD_EXERCISE"; exercise: Exercise; previousSets: WorkoutSet[] }
  | { type: "REMOVE_EXERCISE"; exerciseIndex: number }
  | {
      type: "ADD_SET";
      exerciseIndex: number;
    }
  | {
      type: "UPDATE_SET";
      exerciseIndex: number;
      setId: string;
      updates: Partial<ActiveSet>;
    }
  | { type: "REMOVE_SET"; exerciseIndex: number; setId: string }
  | { type: "COMPLETE_SET"; exerciseIndex: number; setId: string }
  | { type: "START_REST_TIMER"; seconds: number }
  | { type: "TICK_REST_TIMER" }
  | { type: "CANCEL_REST_TIMER" }
  | {
      type: "ADD_PR";
      exerciseId: number;
      exerciseName: string;
      prType: RecordType;
    }
  | { type: "SET_NAME"; name: string }
  | { type: "RESET" };

function workoutReducer(
  state: WorkoutState,
  action: WorkoutAction
): WorkoutState {
  switch (action.type) {
    case "START_WORKOUT":
      return {
        ...initialState,
        isActive: true,
        sessionName: action.name,
        startedAt: nowISO(),
      };

    case "ADD_EXERCISE": {
      const nextSetNumber =
        action.previousSets.length > 0
          ? Math.max(...action.previousSets.map((s) => s.set_number))
          : 3;
      const sets: ActiveSet[] = Array.from(
        { length: Math.min(nextSetNumber, 5) },
        (_, i) => ({
          id: uuid.v4() as string,
          set_number: i + 1,
          reps: null,
          weight_kg: null,
          is_warmup: false,
          rpe: null,
          completed: false,
        })
      );
      return {
        ...state,
        exercises: [
          ...state.exercises,
          { exercise: action.exercise, sets, previousSets: action.previousSets },
        ],
      };
    }

    case "REMOVE_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.filter(
          (_, idx) => idx !== action.exerciseIndex
        ),
      };

    case "ADD_SET": {
      const exercises = [...state.exercises];
      const ex = exercises[action.exerciseIndex];
      if (!ex) return state;
      const newSet: ActiveSet = {
        id: uuid.v4() as string,
        set_number: ex.sets.length + 1,
        reps: null,
        weight_kg: null,
        is_warmup: false,
        rpe: null,
        completed: false,
      };
      exercises[action.exerciseIndex] = {
        ...ex,
        sets: [...ex.sets, newSet],
      };
      return { ...state, exercises };
    }

    case "UPDATE_SET": {
      const exercises = state.exercises.map((ex, idx) => {
        if (idx !== action.exerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) =>
            s.id === action.setId ? { ...s, ...action.updates } : s
          ),
        };
      });
      return { ...state, exercises };
    }

    case "REMOVE_SET": {
      const exercises = state.exercises.map((ex, idx) => {
        if (idx !== action.exerciseIndex) return ex;
        const filtered = ex.sets.filter((s) => s.id !== action.setId);
        return {
          ...ex,
          sets: filtered.map((s, i) => ({ ...s, set_number: i + 1 })),
        };
      });
      return { ...state, exercises };
    }

    case "COMPLETE_SET": {
      const exercises = state.exercises.map((ex, idx) => {
        if (idx !== action.exerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) =>
            s.id === action.setId ? { ...s, completed: true } : s
          ),
        };
      });
      return { ...state, exercises };
    }

    case "START_REST_TIMER":
      return {
        ...state,
        restTimer: { remaining: action.seconds, total: action.seconds },
      };

    case "TICK_REST_TIMER":
      if (!state.restTimer || state.restTimer.remaining <= 0)
        return { ...state, restTimer: null };
      return {
        ...state,
        restTimer: {
          ...state.restTimer,
          remaining: state.restTimer.remaining - 1,
        },
      };

    case "CANCEL_REST_TIMER":
      return { ...state, restTimer: null };

    case "ADD_PR":
      return {
        ...state,
        newPRs: [
          ...state.newPRs,
          {
            exerciseId: action.exerciseId,
            exerciseName: action.exerciseName,
            type: action.prType,
          },
        ],
      };

    case "SET_NAME":
      return { ...state, sessionName: action.name };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ── Context ──

interface WorkoutContextValue {
  state: WorkoutState;
  startWorkout: (name: string) => void;
  addExercise: (exercise: Exercise) => Promise<void>;
  removeExercise: (exerciseIndex: number) => void;
  addSet: (exerciseIndex: number) => void;
  updateSet: (
    exerciseIndex: number,
    setId: string,
    updates: Partial<ActiveSet>
  ) => void;
  removeSet: (exerciseIndex: number, setId: string) => void;
  completeSet: (exerciseIndex: number, setId: string) => void;
  startRestTimer: (seconds: number) => void;
  cancelRestTimer: () => void;
  setSessionName: (name: string) => void;
  finishWorkout: () => Promise<number | null>;
  cancelWorkout: () => void;
  getElapsedMinutes: () => number;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [state, dispatch] = useReducer(workoutReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rest timer tick
  useEffect(() => {
    if (state.restTimer && state.restTimer.remaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK_REST_TIMER" });
      }, 1000);
    } else if (state.restTimer && state.restTimer.remaining <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch({ type: "CANCEL_REST_TIMER" });
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.restTimer?.remaining]);

  const startWorkout = useCallback((name: string) => {
    dispatch({ type: "START_WORKOUT", name });
  }, []);

  const addExercise = useCallback(
    async (exercise: Exercise) => {
      // Fetch previous session's sets for this exercise
      const previousSets = await db.getAllAsync<WorkoutSet>(
        `SELECT ws.* FROM workout_sets ws
         JOIN workout_sessions s ON ws.session_id = s.id
         WHERE ws.exercise_id = ? AND s.finished_at IS NOT NULL
         ORDER BY s.started_at DESC, ws.set_number ASC
         LIMIT 10`,
        [exercise.id]
      );
      dispatch({ type: "ADD_EXERCISE", exercise, previousSets });
    },
    [db]
  );

  const removeExercise = useCallback((exerciseIndex: number) => {
    dispatch({ type: "REMOVE_EXERCISE", exerciseIndex });
  }, []);

  const addSet = useCallback((exerciseIndex: number) => {
    dispatch({ type: "ADD_SET", exerciseIndex });
  }, []);

  const updateSet = useCallback(
    (exerciseIndex: number, setId: string, updates: Partial<ActiveSet>) => {
      dispatch({ type: "UPDATE_SET", exerciseIndex, setId, updates });
    },
    []
  );

  const removeSet = useCallback((exerciseIndex: number, setId: string) => {
    dispatch({ type: "REMOVE_SET", exerciseIndex, setId });
  }, []);

  const completeSet = useCallback(
    (exerciseIndex: number, setId: string) => {
      dispatch({ type: "COMPLETE_SET", exerciseIndex, setId });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    []
  );

  const startRestTimer = useCallback((seconds: number) => {
    dispatch({ type: "START_REST_TIMER", seconds });
  }, []);

  const cancelRestTimer = useCallback(() => {
    dispatch({ type: "CANCEL_REST_TIMER" });
  }, []);

  const setSessionName = useCallback((name: string) => {
    dispatch({ type: "SET_NAME", name });
  }, []);

  const finishWorkout = useCallback(async (): Promise<number | null> => {
    if (!state.startedAt) return null;

    const finishedAt = nowISO();
    const durationMinutes = getDurationMinutes(state.startedAt, finishedAt);

    // Insert session
    const sessionResult = await db.runAsync(
      `INSERT INTO workout_sessions (name, started_at, finished_at, duration_minutes, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [state.sessionName || "Workout", state.startedAt, finishedAt, durationMinutes, null]
    );
    const sessionId = sessionResult.lastInsertRowId;

    // Insert sets and detect PRs
    for (const ex of state.exercises) {
      const completedSets = ex.sets.filter((s) => s.completed);
      const insertedSets: WorkoutSet[] = [];

      for (const set of completedSets) {
        const result = await db.runAsync(
          `INSERT INTO workout_sets (session_id, exercise_id, set_number, reps, weight_kg, is_warmup, rpe)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            sessionId,
            ex.exercise.id,
            set.set_number,
            set.reps ?? 0,
            set.weight_kg ?? 0,
            set.is_warmup ? 1 : 0,
            set.rpe,
          ]
        );
        insertedSets.push({
          id: result.lastInsertRowId,
          session_id: sessionId,
          exercise_id: ex.exercise.id,
          set_number: set.set_number,
          reps: set.reps ?? 0,
          weight_kg: set.weight_kg ?? 0,
          is_warmup: set.is_warmup ? 1 : 0,
          rest_seconds: null,
          rpe: set.rpe,
          notes: null,
          created_at: finishedAt,
        });
      }

      // Detect PRs
      const prs = await detectAndSavePRs(
        db,
        ex.exercise.id,
        sessionId,
        insertedSets
      );
      for (const pr of prs) {
        dispatch({
          type: "ADD_PR",
          exerciseId: ex.exercise.id,
          exerciseName: ex.exercise.name,
          prType: pr.type,
        });
      }
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return sessionId;
  }, [db, state]);

  const cancelWorkout = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const getElapsedMinutes = useCallback((): number => {
    if (!state.startedAt) return 0;
    return getDurationMinutes(state.startedAt, nowISO());
  }, [state.startedAt]);

  return (
    <WorkoutContext.Provider
      value={{
        state,
        startWorkout,
        addExercise,
        removeExercise,
        addSet,
        updateSet,
        removeSet,
        completeSet,
        startRestTimer,
        cancelRestTimer,
        setSessionName,
        finishWorkout,
        cancelWorkout,
        getElapsedMinutes,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx)
    throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
