import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { useColorScheme } from "nativewind";
import { useSQLiteContext } from "expo-sqlite";
import type { ThemeMode } from "../types";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const systemScheme = useSystemColorScheme();
  const { setColorScheme } = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const row = await db.getFirstAsync<{ theme_mode: string }>(
        "SELECT theme_mode FROM user_settings WHERE id = 1"
      );
      if (row?.theme_mode) {
        setThemeState(row.theme_mode as ThemeMode);
      }
      setIsLoaded(true);
    })();
  }, [db]);

  const resolvedTheme: "light" | "dark" =
    theme === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : theme;

  useEffect(() => {
    if (isLoaded) {
      setColorScheme(resolvedTheme);
    }
  }, [resolvedTheme, isLoaded, setColorScheme]);

  const setTheme = async (mode: ThemeMode) => {
    setThemeState(mode);
    await db.runAsync(
      "UPDATE user_settings SET theme_mode = ?, updated_at = datetime('now') WHERE id = 1",
      [mode]
    );
  };

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
