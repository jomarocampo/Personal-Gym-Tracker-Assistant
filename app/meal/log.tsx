import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useMealLog } from "@/hooks/useMeals";
import { todayISO } from "@/utils/dates";
import type { MealCategory } from "@/types";

const MEAL_TIMES: { label: string; value: MealCategory }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];

export default function MealLogScreen() {
  const { colorScheme } = useColorScheme();
  const primaryColor = colorScheme === "dark" ? "#818CF8" : "#6366F1";
  const today = todayISO();
  const { entries, totals, logMeal } = useMealLog(today);
  const [mealTime, setMealTime] = useState<MealCategory>("lunch");
  const [customName, setCustomName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleLog = async () => {
    if (!customName.trim() && !calories) {
      Alert.alert("Missing Info", "Enter a meal name or calories.");
      return;
    }
    await logMeal({
      custom_name: customName.trim() || "Quick meal",
      meal_time: mealTime,
      calories: calories ? parseInt(calories, 10) : undefined,
      protein_g: protein ? parseFloat(protein) : undefined,
      carbs_g: carbs ? parseFloat(carbs) : undefined,
      fat_g: fat ? parseFloat(fat) : undefined,
    });
    Alert.alert("Logged!", "Meal has been logged.");
    setCustomName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View className="flex-row items-center px-4 pb-4 pt-2">
            <Pressable onPress={() => router.back()} className="mr-3 p-1">
              <Ionicons name="arrow-back" size={24} color={primaryColor} />
            </Pressable>
            <Text className="text-2xl font-bold text-text-primary">
              Log Meal
            </Text>
          </View>

          {/* Today's Total */}
          <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
            <Text className="mb-2 text-sm font-bold text-text-secondary">
              Today's Total
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-lg font-bold text-text-primary">
                  {totals.calories}
                </Text>
                <Text className="text-xs text-text-muted">kcal</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-text-primary">
                  {Math.round(totals.protein_g)}g
                </Text>
                <Text className="text-xs text-text-muted">protein</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-text-primary">
                  {Math.round(totals.carbs_g)}g
                </Text>
                <Text className="text-xs text-text-muted">carbs</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-text-primary">
                  {Math.round(totals.fat_g)}g
                </Text>
                <Text className="text-xs text-text-muted">fat</Text>
              </View>
            </View>
          </View>

          {/* Quick Log Form */}
          <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
            <Text className="mb-3 text-base font-bold text-text-primary">
              Quick Log
            </Text>

            {/* Meal time selector */}
            <View className="mb-3 flex-row gap-2">
              {MEAL_TIMES.map((mt) => (
                <Pressable
                  key={mt.value}
                  className={`flex-1 rounded-lg py-2 ${
                    mealTime === mt.value ? "bg-primary" : "bg-surface"
                  }`}
                  onPress={() => setMealTime(mt.value)}
                >
                  <Text
                    className={`text-center text-xs font-medium ${
                      mealTime === mt.value
                        ? "text-white"
                        : "text-text-secondary"
                    }`}
                  >
                    {mt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              className="mb-3 rounded-xl bg-surface px-4 py-3 text-text-primary"
              placeholder="Meal name"
              placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
              value={customName}
              onChangeText={setCustomName}
            />

            <View className="mb-3 flex-row gap-2">
              <TextInput
                className="flex-1 rounded-xl bg-surface px-3 py-2.5 text-center text-text-primary"
                placeholder="kcal"
                placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
                keyboardType="number-pad"
                value={calories}
                onChangeText={setCalories}
              />
              <TextInput
                className="flex-1 rounded-xl bg-surface px-3 py-2.5 text-center text-text-primary"
                placeholder="protein"
                placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
                keyboardType="decimal-pad"
                value={protein}
                onChangeText={setProtein}
              />
              <TextInput
                className="flex-1 rounded-xl bg-surface px-3 py-2.5 text-center text-text-primary"
                placeholder="carbs"
                placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
                keyboardType="decimal-pad"
                value={carbs}
                onChangeText={setCarbs}
              />
              <TextInput
                className="flex-1 rounded-xl bg-surface px-3 py-2.5 text-center text-text-primary"
                placeholder="fat"
                placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
                keyboardType="decimal-pad"
                value={fat}
                onChangeText={setFat}
              />
            </View>

            <Pressable
              className="rounded-xl bg-primary py-3"
              onPress={handleLog}
            >
              <Text className="text-center text-base font-bold text-white">
                Log Meal
              </Text>
            </Pressable>
          </View>

          {/* Today's Entries */}
          {entries.length > 0 && (
            <View className="mx-4 mb-4">
              <Text className="mb-2 text-base font-bold text-text-primary">
                Logged Today
              </Text>
              {entries.map((entry) => (
                <View
                  key={entry.id}
                  className="mb-2 rounded-xl border border-border bg-card p-3"
                >
                  <Text className="font-medium text-text-primary">
                    {entry.meal_name ?? entry.custom_name ?? "Meal"}
                  </Text>
                  <Text className="text-sm text-text-secondary">
                    {entry.calories ?? 0} kcal - {entry.meal_time}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Browse Meals Link */}
          <Pressable
            className="mx-4 mb-8 rounded-xl border border-dashed border-primary py-3"
            onPress={() => router.push("/(tabs)/meals")}
          >
            <Text className="text-center text-base font-medium text-primary">
              Browse Meal Library
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
