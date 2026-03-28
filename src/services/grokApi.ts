import type { ChatRole, GrokChatResponse } from "@/types/chat";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const GROK_MODEL = "grok-3-mini";

export class GrokError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "GrokError";
    this.status = status;
  }
}

export async function sendGrokMessage(
  apiKey: string,
  messages: { role: ChatRole; content: string }[]
): Promise<{ content: string; tokensUsed: number }> {
  let response: Response;
  try {
    response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });
  } catch {
    throw new GrokError(0, "No internet connection. Please check your network.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const msg = body?.error?.message ?? "Unknown error";

    if (response.status === 401) {
      throw new GrokError(401, "Invalid API key. Check your key in Settings.");
    }
    if (response.status === 429) {
      throw new GrokError(429, "Rate limit exceeded. Please wait a moment.");
    }
    throw new GrokError(response.status, msg);
  }

  const data: GrokChatResponse = await response.json();
  return {
    content: data.choices[0]!.message.content,
    tokensUsed: data.usage.total_tokens,
  };
}
