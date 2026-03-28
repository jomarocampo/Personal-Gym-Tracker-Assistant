import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type PropsWithChildren,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { UserSettings, FitnessGoal, WeightUnit } from "../types";

interface SettingsContextValue {
  settings: UserSettings | null;
  isLoading: boolean;
  updateSetting: <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => Promise<void>;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const row = await db.getFirstAsync<UserSettings>(
      "SELECT * FROM user_settings WHERE id = 1"
    );
    setSettings(row ?? null);
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSetting = useCallback(
    async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      await db.runAsync(
        `UPDATE user_settings SET ${key} = ?, updated_at = datetime('now') WHERE id = 1`,
        [value as string | number]
      );
      await refresh();
    },
    [db, refresh]
  );

  return (
    <SettingsContext.Provider
      value={{ settings, isLoading, updateSetting, refresh }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
