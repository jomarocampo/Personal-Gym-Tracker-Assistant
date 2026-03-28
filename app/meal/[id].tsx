import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { useMealLog } from "@/hooks/useMeals";
import { todayISO } from "@/utils/dates";
import type { Meal } from "@/types";

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [meal, setMeal] = useState<Meal | null>(null);
  const { logMeal } = useMealLog(todayISO());

  useEffect(() => {
    (async () => {
      const row = await db.getFirstAsync<Meal>(
        "SELECT * FROM meals WHERE id = ?",
        [Number(id)]
      );
      setMeal(row ?? null);
    })();
  }, [db, id]);

  if (!meal) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-secondary">Loading...</Text>
      </SafeAreaView>
    );
  }

  const tags: string[] = meal.tags ? JSON.parse(meal.tags) : [];

  const handleLog = async () => {
    await logMeal({
      meal_id: meal.id,
      meal_time: meal.category,
      calories: meal.calories ?? undefined,
      protein_g: meal.protein_g ?? undefined,
      carbs_g: meal.carbs_g ?? undefined,
      fat_g: meal.fat_g ?? undefined,
    });
    Alert.alert("Logged!", `${meal.name} has been logged for today.`);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row items-center px-4 pb-4 pt-2">
          <Pressable onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color="#6366F1" />
          </Pressable>
          <Text className="flex-1 text-2xl font-bold text-text-primary">
            {meal.name}
          </Text>
        </View>

        {/* Category & Tags */}
        <View className="mb-4 flex-row flex-wrap gap-2 px-4">
          <View className="rounded-full bg-primary/15 px-3 py-1">
            <Text className="text-sm font-medium text-primary">
              {meal.category.replace("_", " ")}
            </Text>
          </View>
          {tags.map((tag) => (
            <View key={tag} className="rounded-full bg-surface px-3 py-1">
              <Text className="text-sm text-text-secondary">
                {tag.replace("_", " ")}
              </Text>
            </View>
          ))}
        </View>

        {/* Macros */}
        <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-3 text-base font-bold text-text-primary">
            Nutrition
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {meal.calories ?? 0}
              </Text>
              <Text className="text-xs text-text-muted">kcal</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-info">
                {meal.protein_g ?? 0}g
              </Text>
              <Text className="text-xs text-text-muted">protein</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-warning">
                {meal.carbs_g ?? 0}g
              </Text>
              <Text className="text-xs text-text-muted">carbs</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-danger">
                {meal.fat_g ?? 0}g
              </Text>
              <Text className="text-xs text-text-muted">fat</Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        {meal.instructions && (
          <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
            <Text className="mb-2 text-base font-bold text-text-primary">
              Instructions
            </Text>
            <Text className="text-sm leading-5 text-text-secondary">
              {meal.instructions}
            </Text>
          </View>
        )}

        {/* Ingredients */}
        {meal.ingredients && (
          <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
            <Text className="mb-2 text-base font-bold text-text-primary">
              Ingredients
            </Text>
            {(JSON.parse(meal.ingredients) as string[]).map(
              (ingredient, i) => (
                <Text key={i} className="text-sm text-text-secondary">
                  - {ingredient}
                </Text>
              )
            )}
          </View>
        )}
      </ScrollView>

      {/* Log Button */}
      <View className="px-4 pb-4">
        <Pressable className="rounded-xl bg-primary py-4" onPress={handleLog}>
          <Text className="text-center text-lg font-bold text-white">
            Log This Meal
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
