import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useMeals } from "@/hooks/useMeals";
import type { MealCategory } from "@/types";

const CATEGORIES: { label: string; value: MealCategory }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
  { label: "Pre-Workout", value: "pre_workout" },
  { label: "Post-Workout", value: "post_workout" },
];

export default function CreateMealScreen() {
  const { colorScheme } = useColorScheme();
  const primaryColor = colorScheme === "dark" ? "#818CF8" : "#6366F1";
  const { createMeal } = useMeals();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MealCategory>("lunch");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [instructions, setInstructions] = useState("");

  const isValid = name.trim().length > 0;

  const handleCreate = async () => {
    if (!isValid) return;
    await createMeal({
      name: name.trim(),
      category,
      calories: calories ? parseInt(calories, 10) : null,
      protein_g: protein ? parseFloat(protein) : null,
      carbs_g: carbs ? parseFloat(carbs) : null,
      fat_g: fat ? parseFloat(fat) : null,
      fiber_g: null,
      ingredients: null,
      instructions: instructions.trim() || null,
      tags: null,
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="flex-row items-center px-4 pb-4 pt-2">
            <Pressable onPress={() => router.back()} className="mr-3 p-1">
              <Ionicons name="arrow-back" size={24} color={primaryColor} />
            </Pressable>
            <Text className="text-2xl font-bold text-text-primary">
              Create Meal
            </Text>
          </View>

          <View className="gap-4 px-4">
            <TextInput
              className="rounded-xl bg-surface px-4 py-3 text-text-primary"
              placeholder="Meal name"
              placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
              value={name}
              onChangeText={setName}
            />

            {/* Category */}
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.value}
                  className={`rounded-full px-3 py-1.5 ${
                    category === cat.value
                      ? "bg-primary"
                      : "border border-border bg-surface"
                  }`}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      category === cat.value
                        ? "text-white"
                        : "text-text-secondary"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Macros */}
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className="mb-1 text-xs text-text-muted">Calories</Text>
                <TextInput
                  className="rounded-xl bg-surface px-3 py-2.5 text-center text-text-primary"
                  keyboardType="number-pad"
                  placeholder="kcal"
                  placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
                  value={calories}
                  onChangeText={setCalories}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-xs text-text-muted">Protein</Text>
                <TextInput
                  className="rounded-xl bg-surface px-3 py-2.5 text-center text-text-primary"
                  keyboardType="decimal-pad"
                  placeholder="g"
                  placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
                  value={protein}
                  onChangeText={setProtein}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-xs text-text-muted">Carbs</Text>
                <TextInput
                  className="rounded-xl bg-surface px-3 py-2.5 text-center text-text-primary"
                  keyboardType="decimal-pad"
                  placeholder="g"
                  placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
                  value={carbs}
                  onChangeText={setCarbs}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-xs text-text-muted">Fat</Text>
                <TextInput
                  className="rounded-xl bg-surface px-3 py-2.5 text-center text-text-primary"
                  keyboardType="decimal-pad"
                  placeholder="g"
                  placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
                  value={fat}
                  onChangeText={setFat}
                />
              </View>
            </View>

            <TextInput
              className="h-24 rounded-xl bg-surface px-4 py-3 text-text-primary"
              placeholder="Instructions (optional)"
              placeholderTextColor={colorScheme === "dark" ? "#6B7280" : "#9CA3AF"}
              multiline
              textAlignVertical="top"
              value={instructions}
              onChangeText={setInstructions}
            />

            <Pressable
              className={`rounded-xl py-4 ${isValid ? "bg-primary" : "bg-primary/40"}`}
              onPress={handleCreate}
              disabled={!isValid}
            >
              <Text className="text-center text-lg font-bold text-white">
                Create Meal
              </Text>
            </Pressable>
          </View>

          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
