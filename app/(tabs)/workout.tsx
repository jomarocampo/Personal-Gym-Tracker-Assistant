import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWorkout } from "@/context/WorkoutContext";
import { useTemplates } from "@/hooks/useTemplates";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { formatWorkoutDate, formatDuration } from "@/utils/dates";

export default function WorkoutScreen() {
  const { state } = useWorkout();
  const { templates } = useTemplates();
  const { sessions } = useWorkoutHistory(3);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1 px-4">
        <Text className="mb-6 mt-4 text-3xl font-bold text-text-primary">
          Workout
        </Text>

        {/* Active Workout Banner */}
        {state.isActive && (
          <Pressable
            className="mb-6 rounded-2xl bg-primary p-4"
            onPress={() => router.push("/workout/active")}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-white">
                  {state.sessionName || "Workout in Progress"}
                </Text>
                <Text className="mt-1 text-sm text-white/70">
                  {state.exercises.length} exercise
                  {state.exercises.length !== 1 ? "s" : ""} -{" "}
                  {state.exercises.reduce(
                    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
                    0
                  )}{" "}
                  sets done
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </Pressable>
        )}

        {/* Quick Start */}
        {!state.isActive && (
          <Pressable
            className="mb-6 rounded-2xl bg-primary p-5"
            onPress={() => router.push("/workout/new")}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={28} color="white" />
              <Text className="ml-3 text-lg font-bold text-white">
                Start Empty Workout
              </Text>
            </View>
          </Pressable>
        )}

        {/* Templates */}
        <Text className="mb-3 text-lg font-bold text-text-primary">
          Templates
        </Text>
        {templates.map((template) => (
          <Pressable
            key={template.id}
            className="mb-2 rounded-xl border border-border bg-card p-4"
            onPress={() => {
              if (state.isActive) {
                router.push("/workout/active");
              } else {
                router.push({
                  pathname: "/workout/new",
                  params: { templateId: template.id.toString() },
                });
              }
            }}
          >
            <Text className="text-base font-semibold text-text-primary">
              {template.name}
            </Text>
            {template.description && (
              <Text className="mt-1 text-sm text-text-secondary">
                {template.description}
              </Text>
            )}
          </Pressable>
        ))}

        {/* Recent Workouts */}
        {sessions.length > 0 && (
          <>
            <Text className="mb-3 mt-6 text-lg font-bold text-text-primary">
              Recent Workouts
            </Text>
            {sessions.map((session) => (
              <Pressable
                key={session.id}
                className="mb-2 rounded-xl border border-border bg-card p-4"
                onPress={() =>
                  router.push(`/workout/${session.id}`)
                }
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-base font-semibold text-text-primary">
                      {session.name || "Workout"}
                    </Text>
                    <Text className="mt-1 text-sm text-text-secondary">
                      {formatWorkoutDate(session.started_at)}
                      {session.duration_minutes
                        ? ` - ${formatDuration(session.duration_minutes)}`
                        : ""}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#9CA3AF"
                  />
                </View>
              </Pressable>
            ))}
          </>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
