import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGrokChat } from "@/hooks/useGrokChat";
import { getGrokApiKey } from "@/services/secureStore";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ChatMessage } from "@/types/chat";

export default function AssistantScreen() {
  const router = useRouter();
  const { messages, isLoading, isSending, error, sendMessage, clearMessages } =
    useGrokChat();
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    getGrokApiKey().then((key) => setHasApiKey(!!key));
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isSending]);

  if (hasApiKey === null || isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-text-secondary">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!hasApiKey) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <Text className="text-2xl font-bold text-text-primary mt-4 mb-2 px-4">
          AI Coach
        </Text>
        <View className="flex-1 justify-center">
          <EmptyState
            icon="key-outline"
            title="API Key Required"
            subtitle="Add your Grok API key in Settings to start chatting with your AI fitness coach."
            actionLabel="Go to Settings"
            onAction={() => router.push("/(tabs)/profile")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-2xl font-bold text-text-primary">AI Coach</Text>
        {messages.length > 0 && (
          <Text
            className="text-sm text-danger font-medium"
            onPress={() =>
              Alert.alert(
                "Clear Chat",
                "Delete all chat history?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Clear",
                    style: "destructive",
                    onPress: clearMessages,
                  },
                ]
              )
            }
          >
            Clear
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <View className="flex-1 justify-center">
            <EmptyState
              icon="chatbubble-ellipses-outline"
              title="Start a Conversation"
              subtitle="Ask about workouts, nutrition, form tips, or get personalized training advice."
            />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerClassName="px-4 pt-2 pb-4"
            showsVerticalScrollIndicator={false}
            ListFooterComponent={isSending ? <TypingIndicator /> : null}
          />
        )}

        <ChatInput onSend={sendMessage} disabled={isSending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
