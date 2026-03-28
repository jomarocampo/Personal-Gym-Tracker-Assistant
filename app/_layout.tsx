import "../global.css";
import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "nativewind";
import { ThemeProvider } from "@/context/ThemeContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { migrateDatabase } from "@/db/migrations";

function LoadingFallback() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#6366F1" />
    </View>
  );
}

function AppContent() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="workout/active"
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="workout/new" />
        <Stack.Screen name="workout/[id]" />
        <Stack.Screen name="exercise/[id]" />
        <Stack.Screen name="exercise/create" />
        <Stack.Screen name="meal/[id]" />
        <Stack.Screen name="meal/create" />
        <Stack.Screen name="meal/log" />
        <Stack.Screen name="template/[id]" />
        <Stack.Screen name="template/create" />
        <Stack.Screen name="history/index" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Suspense fallback={<LoadingFallback />}>
        <SQLiteProvider
          databaseName="gymbuddy.db"
          onInit={migrateDatabase}
          useSuspense
        >
          <ThemeProvider>
            <SettingsProvider>
              <WorkoutProvider>
                <AppContent />
              </WorkoutProvider>
            </SettingsProvider>
          </ThemeProvider>
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
}
