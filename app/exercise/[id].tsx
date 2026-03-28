import React from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useExercise, useExerciseHistory } from "@/hooks/useExercises";
import { usePersonalRecords } from "@/hooks/usePersonalRecords";

function difficultyVariant(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "success" as const;
    case "intermediate":
      return "warning" as const;
    case "advanced":
      return "danger" as const;
    default:
      return "default" as const;
  }
}

function formatRecordType(type: string): string {
  switch (type) {
    case "max_weight":
      return "Max Weight";
    case "max_reps":
      return "Max Reps";
    case "max_volume":
      return "Max Volume";
    default:
      return type;
  }
}

function formatRecordValue(type: string, value: number): string {
  switch (type) {
    case "max_weight":
      return `${value} kg`;
    case "max_reps":
      return `${value} reps`;
    case "max_volume":
      return `${value} kg`;
    default:
      return `${value}`;
  }
}

function formatSetsSummary(sets: { reps: number; weight_kg: number }[]): string {
  if (sets.length === 0) return "";
  const allSameReps = sets.every((s) => s.reps === sets[0].reps);
  const allSameWeight = sets.every((s) => s.weight_kg === sets[0].weight_kg);

  if (allSameReps && allSameWeight) {
    return `${sets.length}x${sets[0].reps} @ ${sets[0].weight_kg}kg`;
  }

  return sets.map((s) => `${s.reps}@${s.weight_kg}kg`).join(", ");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exerciseId = Number(id);

  const { exercise, isLoading: exerciseLoading } = useExercise(exerciseId);
  const { history, isLoading: historyLoading } = useExerciseHistory(exerciseId);
  const { records, isLoading: recordsLoading } = usePersonalRecords(exerciseId);

  if (exerciseLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-text-secondary text-base">Exercise not found</Text>
      </SafeAreaView>
    );
  }

  const recentHistory = history.slice(0, 5);
  const maxWeight = records.find((r) => r.record_type === "max_weight");
  const maxReps = records.find((r) => r.record_type === "max_reps");
  const maxVolume = records.find((r) => r.record_type === "max_volume");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 p-1"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={24} className="text-text-primary" />
          </Pressable>
          <Text className="text-2xl font-bold text-text-primary flex-1" numberOfLines={2}>
            {exercise.name}
          </Text>
        </View>

        {/* Badges */}
        <View className="flex-row flex-wrap gap-2 px-4 mb-4">
          <Badge label={exercise.muscle_group.replace("_", " ")} variant="primary" />
          <Badge label={exercise.equipment} variant="default" />
          <Badge label={exercise.difficulty} variant={difficultyVariant(exercise.difficulty)} />
        </View>

        {/* Instructions */}
        {exercise.instructions ? (
          <View className="px-4 mb-4">
            <Card>
              <Text className="text-base font-semibold text-text-primary mb-2">
                Instructions
              </Text>
              <Text className="text-sm text-text-secondary leading-5">
                {exercise.instructions}
              </Text>
            </Card>
          </View>
        ) : null}

        {/* Personal Records */}
        <View className="px-4 mb-4">
          <Card>
            <Text className="text-base font-semibold text-text-primary mb-3">
              Personal Records
            </Text>
            {recordsLoading ? (
              <ActivityIndicator size="small" />
            ) : records.length === 0 ? (
              <Text className="text-sm text-text-muted">No records yet</Text>
            ) : (
              <View className="gap-2">
                {maxWeight ? (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-text-secondary">Max Weight</Text>
                    <Text className="text-sm font-semibold text-text-primary">
                      {formatRecordValue("max_weight", maxWeight.value)}
                    </Text>
                  </View>
                ) : null}
                {maxReps ? (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-text-secondary">Max Reps</Text>
                    <Text className="text-sm font-semibold text-text-primary">
                      {formatRecordValue("max_reps", maxReps.value)}
                    </Text>
                  </View>
                ) : null}
                {maxVolume ? (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-text-secondary">Max Volume</Text>
                    <Text className="text-sm font-semibold text-text-primary">
                      {formatRecordValue("max_volume", maxVolume.value)}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </Card>
        </View>

        {/* Recent History */}
        <View className="px-4 mb-4">
          <Card>
            <Text className="text-base font-semibold text-text-primary mb-3">
              Recent History
            </Text>
            {historyLoading ? (
              <ActivityIndicator size="small" />
            ) : recentHistory.length === 0 ? (
              <Text className="text-sm text-text-muted">
                No workout history for this exercise
              </Text>
            ) : (
              <View className="gap-3">
                {recentHistory.map((session, index) => (
                  <View
                    key={session.date}
                    className={`flex-row justify-between items-center ${
                      index < recentHistory.length - 1 ? "pb-3 border-b border-border" : ""
                    }`}
                  >
                    <Text className="text-sm text-text-secondary">
                      {formatDate(session.date)}
                    </Text>
                    <Text className="text-sm font-medium text-text-primary">
                      {formatSetsSummary(session.sets)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
