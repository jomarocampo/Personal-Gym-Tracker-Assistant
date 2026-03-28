import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { formatWorkoutDate, formatDuration } from "@/utils/dates";
import type { WorkoutSession } from "@/types";

function SessionCard({ session }: { session: WorkoutSession }) {
  return (
    <Pressable
      className="mx-4 mb-3 rounded-2xl border border-border bg-card p-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      onPress={() => router.push(`/workout/${session.id}`)}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-bold text-text-primary">
            {session.name || "Workout"}
          </Text>
          <Text className="mt-1 text-sm text-text-secondary">
            {formatWorkoutDate(session.started_at)}
            {session.duration_minutes
              ? ` - ${formatDuration(session.duration_minutes)}`
              : ""}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const { sessions, isLoading } = useWorkoutHistory(50);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-4 pb-3 pt-2">
        <Pressable onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={24} color="#6366F1" />
        </Pressable>
        <Text className="text-2xl font-bold text-text-primary">
          Workout History
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : sessions.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="barbell-outline" size={48} color="#9CA3AF" />
          <Text className="mt-3 text-base text-text-muted">
            No workouts yet
          </Text>
          <Text className="mt-1 text-sm text-text-muted">
            Start your first workout to see it here
          </Text>
        </View>
      ) : (
        <FlashList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SessionCard session={item} />}

          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}
