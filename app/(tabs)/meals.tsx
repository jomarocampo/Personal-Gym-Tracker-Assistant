import { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMeals, useMealLog } from "@/hooks/useMeals";
import { useSettings } from "@/context/SettingsContext";
import { todayISO } from "@/utils/dates";
import type { Meal, MealCategory } from "@/types";

const CATEGORIES: { label: string; value: MealCategory }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
  { label: "Pre-Workout", value: "pre_workout" },
  { label: "Post-Workout", value: "post_workout" },
];

function MealCard({ meal }: { meal: Meal }) {
  return (
    <Pressable
      className="mx-4 mb-3 rounded-2xl border border-border bg-card p-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      onPress={() => router.push(`/meal/${meal.id}`)}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-bold text-text-primary">
            {meal.name}
          </Text>
          <Text className="mt-1 text-sm text-text-secondary">
            {meal.calories} kcal - {meal.protein_g}g protein
          </Text>
        </View>
        <View className="rounded-full bg-primary/15 px-2.5 py-0.5">
          <Text className="text-xs font-medium text-primary">
            {meal.category.replace("_", " ")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function MealsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<
    MealCategory | undefined
  >(undefined);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: selectedCategory,
    }),
    [debouncedSearch, selectedCategory]
  );

  const { meals, isLoading } = useMeals(filters);
  const { totals } = useMealLog(todayISO());
  const { settings } = useSettings();

  const targetCalories = settings?.target_calories ?? 2500;
  const targetProtein = settings?.target_protein_g ?? 150;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Daily Summary */}
      <View className="mx-4 mt-4 mb-3 rounded-2xl border border-border bg-card p-4">
        <Text className="mb-2 text-sm font-bold text-text-secondary">
          Today's Nutrition
        </Text>
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-xl font-bold text-text-primary">
              {totals.calories}
            </Text>
            <Text className="text-xs text-text-muted">
              / {targetCalories} kcal
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-text-primary">
              {Math.round(totals.protein_g)}g
            </Text>
            <Text className="text-xs text-text-muted">
              / {targetProtein}g protein
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-text-primary">
              {Math.round(totals.carbs_g)}g
            </Text>
            <Text className="text-xs text-text-muted">carbs</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-text-primary">
              {Math.round(totals.fat_g)}g
            </Text>
            <Text className="text-xs text-text-muted">fat</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
          <View
            className="h-full rounded-full bg-primary"
            style={{
              width: `${Math.min(100, (totals.calories / targetCalories) * 100)}%`,
            }}
          />
        </View>
      </View>

      {/* Category filter */}
      <View className="mb-2 px-4">
        <View className="flex-row flex-wrap gap-2">
          <Pressable
            className={`rounded-full px-3 py-1.5 ${
              !selectedCategory
                ? "bg-primary"
                : "border border-border bg-surface"
            }`}
            onPress={() => setSelectedCategory(undefined)}
          >
            <Text
              className={`text-sm font-medium ${
                !selectedCategory ? "text-white" : "text-text-secondary"
              }`}
            >
              All
            </Text>
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              className={`rounded-full px-3 py-1.5 ${
                selectedCategory === cat.value
                  ? "bg-primary"
                  : "border border-border bg-surface"
              }`}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === cat.value ? undefined : cat.value
                )
              }
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === cat.value
                    ? "text-white"
                    : "text-text-secondary"
                }`}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Meal List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlashList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MealCard meal={item} />}

          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Ionicons name="nutrition-outline" size={48} color="#9CA3AF" />
              <Text className="mt-3 text-base text-text-muted">
                No meals found
              </Text>
            </View>
          }
        />
      )}

      {/* Quick Log FAB */}
      <Pressable
        onPress={() => router.push("/meal/log")}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary"
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        })}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </Pressable>
    </SafeAreaView>
  );
}
