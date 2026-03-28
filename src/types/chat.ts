export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: number;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface GrokChatResponse {
  id: string;
  choices: {
    index: number;
    message: { role: "assistant"; content: string };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
