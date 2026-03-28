import { useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useChatMessages } from "./useChatMessages";
import { getGrokApiKey } from "@/services/secureStore";
import { sendGrokMessage, GrokError } from "@/services/grokApi";
import { buildSystemPrompt } from "@/services/systemPrompt";

const MAX_CONTEXT_MESSAGES = 20;

export function useGrokChat() {
  const db = useSQLiteContext();
  const { messages, isLoading, addMessage, clearMessages } = useChatMessages();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userText: string) => {
      setError(null);
      setIsSending(true);

      try {
        const apiKey = await getGrokApiKey();
        if (!apiKey) {
          setError("No API key set. Add your Grok API key in Settings.");
          setIsSending(false);
          return;
        }

        // Save user message
        await addMessage("user", userText);

        // Build system prompt with user's fitness data
        const systemPrompt = await buildSystemPrompt(db);

        // Get recent messages for context (after adding user message)
        const recentMessages = await db.getAllAsync<{
          role: "user" | "assistant";
          content: string;
        }>(
          `SELECT role, content FROM chat_messages
           WHERE role IN ('user', 'assistant')
           ORDER BY created_at DESC LIMIT ?`,
          [MAX_CONTEXT_MESSAGES]
        );

        // Build messages array: system + recent messages (chronological)
        const apiMessages = [
          { role: "system" as const, content: systemPrompt },
          ...recentMessages.reverse(),
        ];

        // Call Grok API
        const result = await sendGrokMessage(apiKey, apiMessages);

        // Save assistant response
        await addMessage("assistant", result.content);
      } catch (err) {
        const message =
          err instanceof GrokError
            ? err.message
            : "Something went wrong. Please try again.";
        setError(message);
      } finally {
        setIsSending(false);
      }
    },
    [db, addMessage]
  );

  return { messages, isLoading, isSending, error, sendMessage, clearMessages };
}
