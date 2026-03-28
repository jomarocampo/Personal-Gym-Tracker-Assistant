import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { View, useColorScheme as useSystemColorScheme } from "react-native";
import { vars, colorScheme as nativeWindColorScheme } from "nativewind";
import { useSQLiteContext } from "expo-sqlite";
import type { ThemeMode } from "../types";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const lightColors = {
  "--color-background": "255 255 255",
  "--color-surface": "245 245 245",
  "--color-surface-elevated": "235 235 235",
  "--color-border": "224 224 224",
  "--color-text-primary": "17 17 17",
  "--color-text-secondary": "107 114 128",
  "--color-text-muted": "156 163 175",
  "--color-primary": "99 102 241",
  "--color-primary-light": "129 140 248",
  "--color-primary-dark": "79 70 229",
  "--color-success": "34 197 94",
  "--color-warning": "245 158 11",
  "--color-danger": "239 68 68",
  "--color-info": "59 130 246",
  "--color-card": "255 255 255",
  "--color-card-foreground": "17 17 17",
  "--color-muted": "243 244 246",
  "--color-muted-foreground": "107 114 128",
};

const darkColors = {
  "--color-background": "15 15 15",
  "--color-surface": "26 26 26",
  "--color-surface-elevated": "37 37 37",
  "--color-border": "42 42 42",
  "--color-text-primary": "245 245 245",
  "--color-text-secondary": "156 163 175",
  "--color-text-muted": "107 114 128",
  "--color-primary": "129 140 248",
  "--color-primary-light": "165 180 252",
  "--color-primary-dark": "99 102 241",
  "--color-success": "74 222 128",
  "--color-warning": "251 191 36",
  "--color-danger": "248 113 113",
  "--color-info": "96 165 250",
  "--color-card": "26 26 26",
  "--color-card-foreground": "245 245 245",
  "--color-muted": "38 38 38",
  "--color-muted-foreground": "156 163 175",
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const systemScheme = useSystemColorScheme();
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
      nativeWindColorScheme.set(resolvedTheme);
    }
  }, [resolvedTheme, isLoaded]);

  const themeVars = useMemo(
    () => vars(resolvedTheme === "dark" ? darkColors : lightColors),
    [resolvedTheme]
  );

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
      <View style={[{ flex: 1 }, themeVars]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
