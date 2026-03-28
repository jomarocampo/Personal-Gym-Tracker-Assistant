import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSQLiteContext } from "expo-sqlite";
import { useWorkout } from "@/context/WorkoutContext";
import { useSettings } from "@/context/SettingsContext";
import { SetRow } from "@/components/workout/SetRow";
import { RestTimer } from "@/components/workout/RestTimer";
import type { Exercise, WeightUnit } from "@/types";
import { formatDurationSeconds } from "@/utils/dates";

function ExercisePickerModal({
  visible,
  onClose,
  onSelect,
  mutedColor,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  mutedColor: string;
}) {
  const db = useSQLiteContext();
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      const where = search
        ? `WHERE name LIKE '%${search.replace(/'/g, "''")}%'`
        : "";
      const rows = await db.getAllAsync<Exercise>(
        `SELECT * FROM exercises ${where} ORDER BY name ASC LIMIT 50`
      );
      setExercises(rows);
    })();
  }, [db, search, visible]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-xl font-bold text-text-primary">
            Add Exercise
          </Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={28} color={mutedColor} />
          </Pressable>
        </View>

        <View className="mx-4 mb-3 flex-row items-center rounded-xl bg-surface px-3 py-2">
          <Ionicons name="search" size={18} color={mutedColor} />
          <TextInput
            className="ml-2 flex-1 text-base text-text-primary"
            placeholder="Search exercises..."
            placeholderTextColor={mutedColor}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>

        <FlashList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}

          renderItem={({ item }) => (
            <Pressable
              className="mx-4 mb-2 rounded-xl border border-border bg-card p-3"
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text className="text-base font-semibold text-text-primary">
                {item.name}
              </Text>
              <Text className="mt-0.5 text-sm text-text-secondary">
                {item.muscle_group.replace("_", " ")} - {item.equipment}
              </Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

function WorkoutSummaryModal({
  visible,
  onClose,
  exercises,
  durationMinutes,
  newPRs,
}: {
  visible: boolean;
  onClose: () => void;
  exercises: { name: string; setsCompleted: number; volume: number }[];
  durationMinutes: number;
  newPRs: { exerciseName: string; type: string }[];
}) {
  const totalSets = exercises.reduce((sum, ex) => sum + ex.setsCompleted, 0);
  const totalVolume = exercises.reduce((sum, ex) => sum + ex.volume, 0);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1 px-4">
          <Text className="mb-6 mt-8 text-center text-3xl font-bold text-text-primary">
            Workout Complete!
          </Text>

          {/* Stats */}
          <View className="mb-6 flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {durationMinutes}
              </Text>
              <Text className="text-sm text-text-secondary">minutes</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {totalSets}
              </Text>
              <Text className="text-sm text-text-secondary">sets</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {Math.round(totalVolume).toLocaleString()}
              </Text>
              <Text className="text-sm text-text-secondary">volume (kg)</Text>
            </View>
          </View>

          {/* PRs */}
          {newPRs.length > 0 && (
            <View className="mb-6 rounded-2xl bg-warning/10 p-4">
              <View className="mb-2 flex-row items-center">
                <Ionicons name="trophy" size={24} color="#FBBF24" />
                <Text className="ml-2 text-lg font-bold text-warning">
                  New Personal Records!
                </Text>
              </View>
              {newPRs.map((pr, i) => (
                <Text key={i} className="mt-1 text-sm text-text-primary">
                  {pr.exerciseName} - {pr.type.replace("_", " ")}
                </Text>
              ))}
            </View>
          )}

          {/* Exercises */}
          <Text className="mb-3 text-lg font-bold text-text-primary">
            Exercises
          </Text>
          {exercises.map((ex, i) => (
            <View
              key={i}
              className="mb-2 rounded-xl border border-border bg-card p-3"
            >
              <Text className="font-semibold text-text-primary">{ex.name}</Text>
              <Text className="text-sm text-text-secondary">
                {ex.setsCompleted} sets - {Math.round(ex.volume)} kg volume
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="px-4 pb-4">
          <Pressable
            className="rounded-xl bg-primary py-4"
            onPress={onClose}
          >
            <Text className="text-center text-lg font-bold text-white">
              Done
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function ActiveWorkoutScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const primaryColor = isDark ? "#818CF8" : "#6366F1";
  const mutedColor = isDark ? "#6B7280" : "#9CA3AF";
  const dangerColor = isDark ? "#F87171" : "#EF4444";
  const warningColor = isDark ? "#FBBF24" : "#F59E0B";
  const {
    state,
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
  } = useWorkout();
  const { settings } = useSettings();
  const weightUnit: WeightUnit = settings?.weight_unit ?? "kg";

  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Elapsed time ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.startedAt) {
        const start = new Date(state.startedAt).getTime();
        const now = Date.now();
        setElapsedSeconds(Math.floor((now - start) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.startedAt]);

  const handleCompleteSet = useCallback(
    (exerciseIndex: number, setId: string) => {
      completeSet(exerciseIndex, setId);
      startRestTimer(90); // default 90s rest
    },
    [completeSet, startRestTimer]
  );

  const handleFinish = useCallback(async () => {
    const completedSetsCount = state.exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
      0
    );
    if (completedSetsCount === 0) {
      Alert.alert(
        "No Completed Sets",
        "Complete at least one set before finishing."
      );
      return;
    }
    await finishWorkout();
    setShowSummary(true);
  }, [finishWorkout, state.exercises]);

  const handleDiscard = useCallback(() => {
    Alert.alert(
      "Discard Workout?",
      "All progress will be lost. This cannot be undone.",
      [
        { text: "Keep Working", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            cancelWorkout();
            router.back();
          },
        },
      ]
    );
  }, [cancelWorkout]);

  const handleSummaryClose = useCallback(() => {
    setShowSummary(false);
    cancelWorkout();
    router.back();
  }, [cancelWorkout]);

  if (!state.isActive) {
    router.back();
    return null;
  }

  const summaryExercises = state.exercises.map((ex) => ({
    name: ex.exercise.name,
    setsCompleted: ex.sets.filter((s) => s.completed).length,
    volume: ex.sets
      .filter((s) => s.completed && !s.is_warmup)
      .reduce((sum, s) => sum + (s.weight_kg ?? 0) * (s.reps ?? 0), 0),
  }));

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Pressable onPress={handleDiscard}>
          <Text className="text-base font-medium text-danger">Cancel</Text>
        </Pressable>

        <View className="items-center">
          <TextInput
            className="text-center text-lg font-bold text-text-primary"
            value={state.sessionName}
            onChangeText={setSessionName}
            placeholder="Workout Name"
            placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          />
          <Text className="text-sm text-primary">
            {formatDurationSeconds(elapsedSeconds)}
          </Text>
        </View>

        <Pressable
          className="rounded-lg bg-primary px-4 py-1.5"
          onPress={handleFinish}
        >
          <Text className="font-bold text-white">Finish</Text>
        </Pressable>
      </View>

      {/* Rest Timer */}
      {state.restTimer && (
        <RestTimer
          remaining={state.restTimer.remaining}
          total={state.restTimer.total}
          onCancel={cancelRestTimer}
          onAddTime={(seconds) => {
            if (state.restTimer) {
              const newRemaining = Math.max(0, state.restTimer.remaining + seconds);
              cancelRestTimer();
              startRestTimer(newRemaining);
            }
          }}
        />
      )}

      {/* Exercises */}
      <ScrollView className="flex-1">
        {state.exercises.map((activeEx, exerciseIndex) => (
          <View key={exerciseIndex} className="mb-4 mt-2">
            {/* Exercise Header */}
            <View className="flex-row items-center justify-between px-4 py-2">
              <Pressable
                onPress={() =>
                  router.push(`/exercise/${activeEx.exercise.id}`)
                }
              >
                <Text className="text-lg font-bold text-primary">
                  {activeEx.exercise.name}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  Alert.alert("Remove Exercise?", "All sets will be removed.", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Remove",
                      style: "destructive",
                      onPress: () => removeExercise(exerciseIndex),
                    },
                  ]);
                }}
              >
                <Ionicons name="trash-outline" size={20} color={dangerColor} />
              </Pressable>
            </View>

            {/* Set Header */}
            <View className="flex-row items-center px-4 py-1">
              <Text className="w-8 text-center text-xs font-bold text-text-muted">
                SET
              </Text>
              <Text className="w-20 text-center text-xs font-bold text-text-muted">
                PREV
              </Text>
              <Text className="mx-1 flex-1 text-center text-xs font-bold text-text-muted">
                {weightUnit.toUpperCase()}
              </Text>
              <Text className="mx-1 flex-1 text-center text-xs font-bold text-text-muted">
                REPS
              </Text>
              <Text className="mx-1 w-8 text-center text-xs font-bold text-text-muted">
                {" "}
              </Text>
              <Text className="mx-1 w-8 text-center text-xs font-bold text-text-muted">
                {" "}
              </Text>
            </View>

            {/* Sets */}
            {activeEx.sets.map((set, setIndex) => (
              <SetRow
                key={set.id}
                set={set}
                previousSet={activeEx.previousSets[setIndex]}
                weightUnit={weightUnit}
                onUpdate={(updates) =>
                  updateSet(exerciseIndex, set.id, updates)
                }
                onComplete={() => handleCompleteSet(exerciseIndex, set.id)}
                onDelete={() => removeSet(exerciseIndex, set.id)}
              />
            ))}

            {/* Add Set */}
            <Pressable
              className="mx-4 mt-2 rounded-lg bg-surface py-2"
              onPress={() => addSet(exerciseIndex)}
            >
              <Text className="text-center text-sm font-medium text-primary">
                + Add Set
              </Text>
            </Pressable>
          </View>
        ))}

        {/* Add Exercise Button */}
        <Pressable
          className="mx-4 my-4 rounded-xl border border-dashed border-primary py-4"
          onPress={() => setShowExercisePicker(true)}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="add" size={24} color={primaryColor} />
            <Text className="ml-2 text-base font-semibold text-primary">
              Add Exercise
            </Text>
          </View>
        </Pressable>

        <View className="h-24" />
      </ScrollView>

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        visible={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelect={addExercise}
        mutedColor={mutedColor}
      />

      {/* Workout Summary Modal */}
      <WorkoutSummaryModal
        visible={showSummary}
        onClose={handleSummaryClose}
        exercises={summaryExercises}
        durationMinutes={getElapsedMinutes()}
        newPRs={state.newPRs.map((pr) => ({
          exerciseName: pr.exerciseName,
          type: pr.type,
        }))}
      />
    </SafeAreaView>
  );
}
