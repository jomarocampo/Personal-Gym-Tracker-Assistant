import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutDetail } from "@/hooks/useWorkoutHistory";
import { formatFullDate, formatDuration } from "@/utils/dates";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workout, isLoading } = useWorkoutDetail(Number(id));

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-secondary">Workout not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center px-4 pb-4 pt-2">
          <Pressable onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color="#6366F1" />
          </Pressable>
          <Text className="flex-1 text-2xl font-bold text-text-primary">
            {workout.name || "Workout"}
          </Text>
        </View>

        {/* Date & Duration */}
        <View className="mb-4 px-4">
          <Text className="text-sm text-text-secondary">
            {formatFullDate(workout.started_at)}
          </Text>
          {workout.duration_minutes && (
            <Text className="mt-1 text-sm text-text-secondary">
              Duration: {formatDuration(workout.duration_minutes)}
            </Text>
          )}
        </View>

        {/* Stats */}
        <View className="mx-4 mb-4 flex-row justify-around rounded-2xl border border-border bg-card p-4">
          <View className="items-center">
            <Text className="text-xl font-bold text-primary">
              {workout.exercises.length}
            </Text>
            <Text className="text-xs text-text-muted">exercises</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-text-primary">
              {workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)}
            </Text>
            <Text className="text-xs text-text-muted">sets</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-text-primary">
              {Math.round(workout.total_volume).toLocaleString()}
            </Text>
            <Text className="text-xs text-text-muted">kg volume</Text>
          </View>
          {workout.pr_count > 0 && (
            <View className="items-center">
              <Text className="text-xl font-bold text-warning">
                {workout.pr_count}
              </Text>
              <Text className="text-xs text-text-muted">PRs</Text>
            </View>
          )}
        </View>

        {/* Exercises */}
        {workout.exercises.map((group, idx) => (
          <View key={idx} className="mx-4 mb-3 rounded-2xl border border-border bg-card p-4">
            <Pressable
              onPress={() => router.push(`/exercise/${group.exercise.id}`)}
            >
              <Text className="mb-2 text-base font-bold text-primary">
                {group.exercise.name}
              </Text>
            </Pressable>

            {/* Set Header */}
            <View className="mb-1 flex-row">
              <Text className="w-12 text-xs font-bold text-text-muted">SET</Text>
              <Text className="flex-1 text-xs font-bold text-text-muted">WEIGHT</Text>
              <Text className="flex-1 text-xs font-bold text-text-muted">REPS</Text>
              <Text className="w-12 text-xs font-bold text-text-muted">RPE</Text>
            </View>

            {group.sets.map((set) => (
              <View
                key={set.id}
                className={`flex-row py-1 ${set.is_warmup ? "opacity-50" : ""}`}
              >
                <Text className="w-12 text-sm text-text-secondary">
                  {set.is_warmup ? "W" : set.set_number}
                </Text>
                <Text className="flex-1 text-sm text-text-primary">
                  {set.weight_kg} kg
                </Text>
                <Text className="flex-1 text-sm text-text-primary">
                  {set.reps}
                </Text>
                <Text className="w-12 text-sm text-text-muted">
                  {set.rpe ?? "-"}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
