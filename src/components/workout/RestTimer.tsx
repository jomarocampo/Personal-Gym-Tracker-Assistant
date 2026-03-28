import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDurationSeconds } from "../../utils/dates";

interface RestTimerProps {
  remaining: number;
  total: number;
  onCancel: () => void;
  onAddTime: (seconds: number) => void;
}

export function RestTimer({
  remaining,
  total,
  onCancel,
  onAddTime,
}: RestTimerProps) {
  const progress = total > 0 ? (total - remaining) / total : 0;

  return (
    <View className="mx-4 mb-3 rounded-2xl bg-primary p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="timer-outline" size={20} color="white" />
          <Text className="ml-2 text-sm font-medium text-white/80">
            Rest Timer
          </Text>
        </View>
        <Pressable onPress={onCancel}>
          <Text className="text-sm font-semibold text-white">Skip</Text>
        </Pressable>
      </View>

      <Text className="my-2 text-center text-4xl font-bold text-white">
        {formatDurationSeconds(remaining)}
      </Text>

      {/* Progress bar */}
      <View className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/20">
        <View
          className="h-full rounded-full bg-white"
          style={{ width: `${progress * 100}%` }}
        />
      </View>

      <View className="flex-row justify-center gap-3">
        <Pressable
          className="rounded-lg bg-white/20 px-4 py-1.5"
          onPress={() => onAddTime(-15)}
        >
          <Text className="text-sm font-medium text-white">-15s</Text>
        </Pressable>
        <Pressable
          className="rounded-lg bg-white/20 px-4 py-1.5"
          onPress={() => onAddTime(30)}
        >
          <Text className="text-sm font-medium text-white">+30s</Text>
        </Pressable>
      </View>
    </View>
  );
}
