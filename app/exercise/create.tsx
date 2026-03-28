import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useExercises } from "@/hooks/useExercises";
import type { MuscleGroup, Equipment, Difficulty } from "@/types";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest", "back", "shoulders", "arms", "legs", "core", "cardio", "full_body",
];
const MUSCLE_GROUP_LABELS = MUSCLE_GROUPS.map((mg) =>
  mg.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
);

const EQUIPMENT_OPTIONS: Equipment[] = [
  "barbell", "dumbbell", "cable", "machine", "bodyweight", "kettlebell", "bands", "none",
];
const EQUIPMENT_LABELS = EQUIPMENT_OPTIONS.map((e) =>
  e.replace(/\b\w/g, (c) => c.toUpperCase())
);

const DIFFICULTY_OPTIONS: Difficulty[] = ["beginner", "intermediate", "advanced"];
const DIFFICULTY_LABELS = ["Beginner", "Intermediate", "Advanced"];

export default function CreateExerciseScreen() {
  const { colorScheme } = useColorScheme();
  const primaryColor = colorScheme === "dark" ? "#818CF8" : "#6366F1";
  const { createExercise } = useExercises();
  const [name, setName] = useState("");
  const [muscleGroupIdx, setMuscleGroupIdx] = useState(0);
  const [equipmentIdx, setEquipmentIdx] = useState(4); // bodyweight default
  const [difficultyIdx, setDifficultyIdx] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = name.trim().length > 0;

  const handleCreate = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await createExercise({
        name: name.trim(),
        muscle_group: MUSCLE_GROUPS[muscleGroupIdx]!,
        equipment: EQUIPMENT_OPTIONS[equipmentIdx]!,
        difficulty: DIFFICULTY_OPTIONS[difficultyIdx]!,
        instructions: instructions.trim() || null,
      });
      router.back();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center px-4 pb-4 pt-2">
            <Pressable onPress={() => router.back()} className="mr-3 p-1">
              <Ionicons name="arrow-back" size={24} color={primaryColor} />
            </Pressable>
            <Text className="text-2xl font-bold text-text-primary">
              Create Exercise
            </Text>
          </View>

          <View className="gap-5 px-4">
            <Input
              label="Exercise Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Incline Dumbbell Press"
            />

            <View className="gap-1.5">
              <Text className="text-sm font-medium text-text-secondary">
                Muscle Group
              </Text>
              <SegmentedControl
                options={MUSCLE_GROUP_LABELS}
                selectedIndex={muscleGroupIdx}
                onChange={setMuscleGroupIdx}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-medium text-text-secondary">
                Equipment
              </Text>
              <SegmentedControl
                options={EQUIPMENT_LABELS}
                selectedIndex={equipmentIdx}
                onChange={setEquipmentIdx}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-medium text-text-secondary">
                Difficulty
              </Text>
              <SegmentedControl
                options={DIFFICULTY_LABELS}
                selectedIndex={difficultyIdx}
                onChange={setDifficultyIdx}
              />
            </View>

            <Input
              label="Instructions (optional)"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Describe how to perform this exercise..."
              multiline
            />

            <View className="mt-2">
              <Button
                label="Create Exercise"
                onPress={handleCreate}
                disabled={!isValid}
                loading={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
