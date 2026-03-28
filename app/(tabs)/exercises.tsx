import { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterChips } from "@/components/ui/FilterChips";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useExercises } from "@/hooks/useExercises";
import type { Exercise, MuscleGroup } from "@/types";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest", "back", "shoulders", "arms", "legs", "core", "cardio", "full_body",
];

function difficultyVariant(difficulty: string) {
  switch (difficulty) {
    case "beginner": return "success" as const;
    case "intermediate": return "warning" as const;
    case "advanced": return "danger" as const;
    default: return "default" as const;
  }
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Pressable
      onPress={() => router.push(`/exercise/${exercise.id}`)}
      className="mx-4 mb-3 rounded-2xl border border-border bg-card p-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Text className="mb-2 text-base font-bold text-text-primary">
        {exercise.name}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        <Badge label={exercise.muscle_group.replace("_", " ")} variant="primary" />
        <Badge label={exercise.equipment} variant="default" />
        <Badge label={exercise.difficulty} variant={difficultyVariant(exercise.difficulty)} />
      </View>
    </Pressable>
  );
}

export default function ExercisesScreen() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      muscle_group: (selectedMuscleGroups[0] as MuscleGroup) ?? undefined,
    }),
    [debouncedSearch, selectedMuscleGroups]
  );

  const { exercises, isLoading } = useExercises(filters);

  const chipOptions = MUSCLE_GROUPS.map((mg) => ({
    label: mg.replace("_", " "),
    value: mg,
  }));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pb-3 pt-2">
        <Text className="mb-3 text-2xl font-bold text-text-primary">
          Exercises
        </Text>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search exercises..."
        />
        <View className="mt-3">
          <FilterChips
            options={chipOptions}
            selected={selectedMuscleGroups}
            onChange={(selected) => {
              // Single-select behavior: take last selected
              if (selected.length > 1) {
                setSelectedMuscleGroups([selected[selected.length - 1]!]);
              } else {
                setSelectedMuscleGroups(selected);
              }
            }}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : exercises.length === 0 ? (
        <EmptyState
          icon="barbell-outline"
          title="No exercises found"
          subtitle="Try adjusting your search or filters"
        />
      ) : (
        <FlashList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ExerciseCard exercise={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <Pressable
        onPress={() => router.push("/exercise/create")}
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
