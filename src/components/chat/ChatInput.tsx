import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <View className="flex-row items-end gap-2 px-4 py-3 bg-background border-t border-border">
      <TextInput
        className="flex-1 bg-card border border-border rounded-2xl px-4 py-3 text-base text-text-primary max-h-28"
        placeholder="Ask your AI coach..."
        placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
        value={text}
        onChangeText={setText}
        multiline
        editable={!disabled}
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        className={`w-11 h-11 rounded-full items-center justify-center ${
          canSend ? "bg-primary" : "bg-surface"
        }`}
      >
        <Ionicons
          name="send"
          size={20}
          color={canSend ? "#FFFFFF" : isDark ? "#4B5563" : "#9CA3AF"}
        />
      </Pressable>
    </View>
  );
}
