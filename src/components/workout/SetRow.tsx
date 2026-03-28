import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import type { ActiveSet, WorkoutSet, WeightUnit } from "../../types";
import { displayWeight, toKg } from "../../utils/units";

interface SetRowProps {
  set: ActiveSet;
  previousSet?: WorkoutSet;
  weightUnit: WeightUnit;
  onUpdate: (updates: Partial<ActiveSet>) => void;
  onComplete: () => void;
  onDelete: () => void;
}

export function SetRow({
  set,
  previousSet,
  weightUnit,
  onUpdate,
  onComplete,
  onDelete,
}: SetRowProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const mutedColor = isDark ? "#6B7280" : "#9CA3AF";
  const warningColor = isDark ? "#FBBF24" : "#F59E0B";
  const successColor = isDark ? "#4ADE80" : "#22C55E";
  const dangerColor = isDark ? "#F87171" : "#EF4444";

  const prevWeight = previousSet
    ? displayWeight(previousSet.weight_kg, weightUnit).toString()
    : "";
  const prevReps = previousSet ? previousSet.reps.toString() : "";

  return (
    <View
      className={`flex-row items-center px-4 py-2 ${
        set.completed
          ? "bg-success/10"
          : set.is_warmup
            ? "opacity-60"
            : ""
      }`}
    >
      {/* Set number */}
      <View className="w-8 items-center">
        <Text className="text-xs font-bold text-text-muted">
          {set.is_warmup ? "W" : set.set_number}
        </Text>
      </View>

      {/* Previous */}
      <View className="w-20 items-center">
        <Text className="text-xs text-text-muted">
          {previousSet
            ? `${displayWeight(previousSet.weight_kg, weightUnit)}×${previousSet.reps}`
            : "-"}
        </Text>
      </View>

      {/* Weight input */}
      <View className="mx-1 flex-1">
        <TextInput
          className="rounded-lg bg-surface px-2 py-1.5 text-center text-sm text-text-primary"
          value={
            set.weight_kg !== null
              ? displayWeight(set.weight_kg, weightUnit).toString()
              : ""
          }
          onChangeText={(text) => {
            const num = parseFloat(text);
            onUpdate({
              weight_kg: isNaN(num) ? null : toKg(num, weightUnit),
            });
          }}
          placeholder={prevWeight || weightUnit}
          placeholderTextColor={mutedColor}
          keyboardType="decimal-pad"
          editable={!set.completed}
        />
      </View>

      {/* Reps input */}
      <View className="mx-1 flex-1">
        <TextInput
          className="rounded-lg bg-surface px-2 py-1.5 text-center text-sm text-text-primary"
          value={set.reps !== null ? set.reps.toString() : ""}
          onChangeText={(text) => {
            const num = parseInt(text, 10);
            onUpdate({ reps: isNaN(num) ? null : num });
          }}
          placeholder={prevReps || "reps"}
          placeholderTextColor={mutedColor}
          keyboardType="number-pad"
          editable={!set.completed}
        />
      </View>

      {/* Warmup toggle */}
      <Pressable
        className="mx-1 w-8 items-center"
        onPress={() => onUpdate({ is_warmup: !set.is_warmup })}
        disabled={set.completed}
      >
        <Ionicons
          name={set.is_warmup ? "flame" : "flame-outline"}
          size={18}
          color={set.is_warmup ? warningColor : mutedColor}
        />
      </Pressable>

      {/* Complete checkbox */}
      <Pressable
        className="mx-1 w-8 items-center"
        onPress={() => {
          if (!set.completed && set.weight_kg !== null && set.reps !== null) {
            onComplete();
          }
        }}
      >
        <Ionicons
          name={set.completed ? "checkmark-circle" : "checkmark-circle-outline"}
          size={24}
          color={set.completed ? successColor : mutedColor}
        />
      </Pressable>

      {/* Delete */}
      {!set.completed && (
        <Pressable className="w-6 items-center" onPress={onDelete}>
          <Ionicons name="close" size={18} color={dangerColor} />
        </Pressable>
      )}
    </View>
  );
}
