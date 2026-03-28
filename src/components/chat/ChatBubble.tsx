import React from "react";
import { View, Text } from "react-native";
import type { ChatMessage } from "@/types/chat";
import { format } from "date-fns";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <View className={`mb-3 ${isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary rounded-tr-sm"
            : "bg-card border border-border rounded-tl-sm"
        }`}
      >
        <Text
          className={`text-base leading-6 ${
            isUser ? "text-white" : "text-text-primary"
          }`}
        >
          {message.content}
        </Text>
      </View>
      <Text className="text-xs text-text-muted mt-1 px-1">
        {format(new Date(message.created_at + "Z"), "h:mm a")}
      </Text>
    </View>
  );
}
