import { useState, useCallback, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { ChatMessage, ChatRole } from "@/types/chat";

export function useChatMessages() {
  const db = useSQLiteContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await db.getAllAsync<ChatMessage>(
      "SELECT * FROM chat_messages ORDER BY created_at ASC"
    );
    setMessages(rows);
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addMessage = useCallback(
    async (role: ChatRole, content: string) => {
      await db.runAsync(
        "INSERT INTO chat_messages (role, content) VALUES (?, ?)",
        [role, content]
      );
      await refresh();
    },
    [db, refresh]
  );

  const clearMessages = useCallback(async () => {
    await db.runAsync("DELETE FROM chat_messages");
    setMessages([]);
  }, [db]);

  return { messages, isLoading, refresh, addMessage, clearMessages };
}
