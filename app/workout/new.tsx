import { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWorkout } from "@/context/WorkoutContext";
import { useTemplateDetail } from "@/hooks/useTemplates";
import { format } from "date-fns";

export default function NewWorkoutScreen() {
  const { templateId } = useLocalSearchParams<{ templateId?: string }>();
  const { startWorkout, addExercise, state } = useWorkout();
  const parsedTemplateId = templateId ? parseInt(templateId, 10) : undefined;
  const { template } = useTemplateDetail(parsedTemplateId ?? 0);

  useEffect(() => {
    if (parsedTemplateId && template && !state.isActive) {
      const name = template.name;
      startWorkout(name);

      // Add all exercises from template
      (async () => {
        for (const te of template.exercises) {
          await addExercise(te.exercise);
        }
        router.replace("/workout/active");
      })();
    }
  }, [template, parsedTemplateId, state.isActive]);

  const handleStartEmpty = () => {
    const name = `Workout - ${format(new Date(), "MMM d")}`;
    startWorkout(name);
    router.replace("/workout/active");
  };

  // If loading template, show loading state
  if (parsedTemplateId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg text-text-secondary">
          Loading template...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#6366F1" />
        </Pressable>
        <Text className="ml-2 text-xl font-bold text-text-primary">
          New Workout
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <Pressable
          className="mt-4 rounded-2xl bg-primary p-6"
          onPress={handleStartEmpty}
        >
          <View className="items-center">
            <Ionicons name="barbell-outline" size={48} color="white" />
            <Text className="mt-3 text-xl font-bold text-white">
              Start Empty Workout
            </Text>
            <Text className="mt-1 text-sm text-white/70">
              Add exercises as you go
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
