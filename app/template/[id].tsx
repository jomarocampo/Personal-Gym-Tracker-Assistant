import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-text-primary">Template Detail</Text>
      <Text className="mt-2 text-text-secondary">ID: {id}</Text>
    </View>
  );
}
