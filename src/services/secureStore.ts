import * as SecureStore from "expo-secure-store";

const GROK_API_KEY = "grok_api_key";

export async function getGrokApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(GROK_API_KEY);
}

export async function setGrokApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(GROK_API_KEY, key);
}

export async function deleteGrokApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(GROK_API_KEY);
}
