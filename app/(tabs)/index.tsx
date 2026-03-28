import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSettings } from "@/context/SettingsContext";
import { useWorkout } from "@/context/WorkoutContext";
import { useWeeklyStats } from "@/hooks/useWorkoutHistory";
import { useRecentPRs } from "@/hooks/usePersonalRecords";
import { useMealLog } from "@/hooks/useMeals";
import { useBodyMetrics } from "@/hooks/useBodyMetrics";
import { formatDuration, todayISO, formatWorkoutDate } from "@/utils/dates";
import { formatWeight } from "@/utils/units";

function QuickAction({
  icon,
  label,
  onPress,
  iconColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  iconColor: string;
}) {
  return (
    <Pressable
      className="flex-1 items-center rounded-2xl border border-border bg-card p-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      onPress={onPress}
    >
      <Ionicons name={icon} size={28} color={iconColor} />
      <Text className="mt-2 text-center text-sm font-medium text-text-primary">
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { settings } = useSettings();
  const { state: workoutState } = useWorkout();
  const { stats } = useWeeklyStats();
  const { records: recentPRs } = useRecentPRs(7);
  const { totals: mealTotals } = useMealLog(todayISO());
  const { latestWeight } = useBodyMetrics();

  const primaryColor = isDark ? "#818CF8" : "#6366F1";
  const mutedColor = isDark ? "#6B7280" : "#9CA3AF";
  const warningColor = isDark ? "#FBBF24" : "#F59E0B";
  const weightUnit = settings?.weight_unit ?? "kg";
  const targetWorkoutDays = settings?.target_workout_days ?? 4;
  const targetCalories = settings?.target_calories ?? 2500;
  const displayName = settings?.display_name ?? "Athlete";

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-text-primary">
            {greeting}, {displayName}!
          </Text>
        </View>

        {/* Active Workout Banner */}
        {workoutState.isActive && (
          <Pressable
            className="mx-4 mb-4 rounded-2xl bg-primary p-4"
            onPress={() => router.push("/workout/active")}
          >
            <View className="flex-row items-center">
              <Ionicons name="barbell" size={24} color="white" />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-white">
                  Workout in Progress
                </Text>
                <Text className="text-sm text-white/70">
                  Tap to continue
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </Pressable>
        )}

        {/* Weekly Stats */}
        <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-3 text-sm font-bold text-text-secondary">
            This Week
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {stats.workoutCount}
              </Text>
              <Text className="text-xs text-text-muted">
                / {targetWorkoutDays} workouts
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-text-primary">
                {formatDuration(stats.totalMinutes)}
              </Text>
              <Text className="text-xs text-text-muted">total time</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-text-primary">
                {Math.round(stats.totalVolume).toLocaleString()}
              </Text>
              <Text className="text-xs text-text-muted">kg volume</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View className="mt-3 h-2 overflow-hidden rounded-full bg-surface-elevated">
            <View
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.min(100, (stats.workoutCount / targetWorkoutDays) * 100)}%`,
              }}
            />
          </View>
        </View>

        {/* Today's Nutrition */}
        <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-2 text-sm font-bold text-text-secondary">
            Today's Nutrition
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-2xl font-bold text-text-primary">
              {mealTotals.calories}
            </Text>
            <Text className="ml-1 text-sm text-text-muted">
              / {targetCalories} kcal
            </Text>
          </View>
          <View className="mt-2 flex-row gap-4">
            <Text className="text-sm text-text-secondary">
              P: {Math.round(mealTotals.protein_g)}g
            </Text>
            <Text className="text-sm text-text-secondary">
              C: {Math.round(mealTotals.carbs_g)}g
            </Text>
            <Text className="text-sm text-text-secondary">
              F: {Math.round(mealTotals.fat_g)}g
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="mb-3 mt-2 px-4 text-lg font-bold text-text-primary">
          Quick Actions
        </Text>
        <View className="mx-4 mb-4 flex-row gap-3">
          <QuickAction
            icon="barbell-outline"
            label="Start Workout"
            onPress={() => router.push("/workout/new")}
            iconColor={primaryColor}
          />
          <QuickAction
            icon="nutrition-outline"
            label="Log Meal"
            onPress={() => router.push("/meal/log")}
            iconColor={primaryColor}
          />
          <QuickAction
            icon="scale-outline"
            label="Log Weight"
            onPress={() => router.push("/(tabs)/profile")}
            iconColor={primaryColor}
          />
        </View>

        {/* Body Weight */}
        {latestWeight !== null && (
          <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
            <Text className="text-sm font-bold text-text-secondary">
              Current Weight
            </Text>
            <Text className="mt-1 text-2xl font-bold text-text-primary">
              {formatWeight(latestWeight, weightUnit)}
            </Text>
          </View>
        )}

        {/* Recent PRs */}
        {recentPRs.length > 0 && (
          <>
            <Text className="mb-3 mt-2 px-4 text-lg font-bold text-text-primary">
              Recent PRs
            </Text>
            {recentPRs.slice(0, 5).map((pr) => (
              <View
                key={pr.id}
                className="mx-4 mb-2 flex-row items-center rounded-xl border border-warning/30 bg-warning/10 p-3"
              >
                <Ionicons name="trophy" size={20} color={warningColor} />
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-text-primary">
                    {pr.exercise_name}
                  </Text>
                  <Text className="text-sm text-text-secondary">
                    {pr.record_type.replace("_", " ")} - {pr.value}
                    {pr.record_type === "max_reps" ? " reps" : " kg"}
                  </Text>
                </View>
                <Text className="text-xs text-text-muted">
                  {formatWorkoutDate(pr.achieved_at)}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
