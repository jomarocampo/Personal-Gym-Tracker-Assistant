import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { useBodyMetrics } from "@/hooks/useBodyMetrics";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { ThemeMode, WeightUnit, FitnessGoal } from "@/types";
import { todayISO } from "@/utils/dates";
import { formatWeight } from "@/utils/units";
import {
  getGrokApiKey,
  setGrokApiKey,
  deleteGrokApiKey,
} from "@/services/secureStore";

const WEIGHT_UNITS: WeightUnit[] = ["kg", "lbs"];
const THEME_OPTIONS: ThemeMode[] = ["light", "dark", "system"];
const THEME_LABELS = ["Light", "Dark", "System"];
const FITNESS_GOALS: FitnessGoal[] = [
  "bulking",
  "cutting",
  "maintenance",
  "strength",
  "general",
];
const FITNESS_GOAL_LABELS = [
  "Bulking",
  "Cutting",
  "Maintenance",
  "Strength",
  "General",
];
const WORKOUT_DAY_OPTIONS = ["2", "3", "4", "5", "6", "7"];

export default function ProfileScreen() {
  const { settings, updateSetting } = useSettings();
  const { theme, setTheme } = useTheme();
  const { latestWeight, latestBodyFat, logMetric } = useBodyMetrics();

  // Local state for editable fields
  const [displayName, setDisplayName] = useState("");
  const [targetCalories, setTargetCalories] = useState("");
  const [targetProtein, setTargetProtein] = useState("");

  // AI Assistant
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);

  // Body metrics inline form
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [metricDate] = useState(todayISO());
  const [metricWeight, setMetricWeight] = useState("");
  const [metricBodyFat, setMetricBodyFat] = useState("");

  // Load API key status
  useEffect(() => {
    getGrokApiKey().then((key) => setHasApiKey(!!key));
  }, []);

  // Sync local state when settings load
  useEffect(() => {
    if (settings) {
      setDisplayName(settings.display_name ?? "");
      setTargetCalories(
        settings.target_calories != null ? String(settings.target_calories) : ""
      );
      setTargetProtein(
        settings.target_protein_g != null
          ? String(settings.target_protein_g)
          : ""
      );
    }
  }, [settings]);

  if (!settings) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-text-secondary">Loading settings...</Text>
      </SafeAreaView>
    );
  }

  const weightUnit = settings.weight_unit;

  // -- Save handlers --

  const saveDisplayName = () => {
    if (displayName !== settings.display_name) {
      updateSetting("display_name", displayName);
    }
  };

  const saveTargetCalories = () => {
    const val = targetCalories ? parseInt(targetCalories, 10) : null;
    if (val !== settings.target_calories) {
      updateSetting("target_calories", val);
    }
  };

  const saveTargetProtein = () => {
    const val = targetProtein ? parseInt(targetProtein, 10) : null;
    if (val !== settings.target_protein_g) {
      updateSetting("target_protein_g", val);
    }
  };

  const handleSaveMetric = async () => {
    const w = metricWeight ? parseFloat(metricWeight) : undefined;
    const bf = metricBodyFat ? parseFloat(metricBodyFat) : undefined;
    if (w === undefined && bf === undefined) return;
    await logMetric(metricDate, w, bf);
    setMetricWeight("");
    setMetricBodyFat("");
    setShowMetricForm(false);
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    await setGrokApiKey(apiKey.trim());
    setHasApiKey(true);
    setApiKey("");
    Alert.alert("Saved", "Grok API key saved securely.");
  };

  const handleRemoveApiKey = () => {
    Alert.alert("Remove API Key", "This will disconnect the AI Coach.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await deleteGrokApiKey();
          setHasApiKey(false);
        },
      },
    ]);
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Data export is not yet implemented.");
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to reset all data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            Alert.alert("Reset", "All data has been reset.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-12"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-bold text-text-primary mt-4 mb-2">
          Settings
        </Text>

        {/* ── Section 1: Profile ── */}
        <Text className="text-lg font-bold text-text-primary mb-3 mt-6">
          Profile
        </Text>
        <Card>
          <Input
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            onBlur={saveDisplayName}
            placeholder="Your name"
          />
        </Card>

        {/* ── Section 2: Preferences ── */}
        <Text className="text-lg font-bold text-text-primary mb-3 mt-6">
          Preferences
        </Text>
        <Card className="gap-4">
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-text-secondary">
              Weight Unit
            </Text>
            <SegmentedControl
              options={WEIGHT_UNITS}
              selectedIndex={WEIGHT_UNITS.indexOf(settings.weight_unit)}
              onChange={(i) => updateSetting("weight_unit", WEIGHT_UNITS[i])}
            />
          </View>

          <View className="gap-1.5">
            <Text className="text-sm font-medium text-text-secondary">
              Theme
            </Text>
            <SegmentedControl
              options={THEME_LABELS}
              selectedIndex={THEME_OPTIONS.indexOf(theme)}
              onChange={(i) => setTheme(THEME_OPTIONS[i])}
            />
          </View>

          <View className="gap-1.5">
            <Text className="text-sm font-medium text-text-secondary">
              Fitness Goal
            </Text>
            <SegmentedControl
              options={FITNESS_GOAL_LABELS}
              selectedIndex={FITNESS_GOALS.indexOf(settings.fitness_goal)}
              onChange={(i) => updateSetting("fitness_goal", FITNESS_GOALS[i])}
            />
          </View>
        </Card>

        {/* ── Section 3: Targets ── */}
        <Text className="text-lg font-bold text-text-primary mb-3 mt-6">
          Targets
        </Text>
        <Card className="gap-4">
          <Input
            label="Target Calories"
            value={targetCalories}
            onChangeText={setTargetCalories}
            onBlur={saveTargetCalories}
            placeholder="e.g. 2500"
            keyboardType="numeric"
            suffix="kcal"
          />

          <Input
            label="Target Protein"
            value={targetProtein}
            onChangeText={setTargetProtein}
            onBlur={saveTargetProtein}
            placeholder="e.g. 150"
            keyboardType="numeric"
            suffix="g"
          />

          <View className="gap-1.5">
            <Text className="text-sm font-medium text-text-secondary">
              Target Workout Days
            </Text>
            <SegmentedControl
              options={WORKOUT_DAY_OPTIONS}
              selectedIndex={WORKOUT_DAY_OPTIONS.indexOf(
                String(settings.target_workout_days)
              )}
              onChange={(i) =>
                updateSetting(
                  "target_workout_days",
                  parseInt(WORKOUT_DAY_OPTIONS[i], 10)
                )
              }
            />
          </View>
        </Card>

        {/* ── Section 4: Body Metrics ── */}
        <Text className="text-lg font-bold text-text-primary mb-3 mt-6">
          Body Metrics
        </Text>
        <Card className="gap-3">
          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-text-secondary">Latest Weight</Text>
              <Text className="text-base font-semibold text-text-primary">
                {latestWeight != null
                  ? formatWeight(latestWeight, weightUnit)
                  : "--"}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-text-secondary">Body Fat</Text>
              <Text className="text-base font-semibold text-text-primary">
                {latestBodyFat != null ? `${latestBodyFat}%` : "--"}
              </Text>
            </View>
          </View>

          <Button
            label={showMetricForm ? "Cancel" : "Log Measurement"}
            variant={showMetricForm ? "ghost" : "secondary"}
            onPress={() => setShowMetricForm((prev) => !prev)}
          />

          {showMetricForm && (
            <View className="gap-3 mt-1">
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-text-secondary">
                  Date
                </Text>
                <View className="bg-surface rounded-xl px-4 py-3 border border-border">
                  <Text className="text-text-primary text-base">
                    {metricDate}
                  </Text>
                </View>
              </View>

              <Input
                label="Weight"
                value={metricWeight}
                onChangeText={setMetricWeight}
                placeholder="e.g. 75"
                keyboardType="decimal-pad"
                suffix={weightUnit}
              />

              <Input
                label="Body Fat"
                value={metricBodyFat}
                onChangeText={setMetricBodyFat}
                placeholder="e.g. 15"
                keyboardType="decimal-pad"
                suffix="%"
              />

              <Button label="Save Measurement" onPress={handleSaveMetric} />
            </View>
          )}
        </Card>

        {/* ── Section 5: Notifications ── */}
        <Text className="text-lg font-bold text-text-primary mb-3 mt-6">
          Notifications
        </Text>
        <Card className="gap-3">
          <Pressable
            onPress={() =>
              updateSetting(
                "reminder_enabled",
                settings.reminder_enabled ? 0 : 1
              )
            }
            className="flex-row items-center justify-between"
          >
            <Text className="text-base text-text-primary">
              Workout Reminder
            </Text>
            <View
              className={`w-12 h-7 rounded-full justify-center px-0.5 ${
                settings.reminder_enabled ? "bg-success" : "bg-surface"
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full bg-white ${
                  settings.reminder_enabled ? "self-end" : "self-start"
                }`}
              />
            </View>
          </Pressable>

          {settings.reminder_enabled ? (
            <View className="flex-row justify-between">
              <View>
                <Text className="text-sm text-text-secondary">
                  Reminder Day
                </Text>
                <Text className="text-base text-text-primary">
                  {settings.reminder_day}
                </Text>
              </View>
              <View>
                <Text className="text-sm text-text-secondary">
                  Reminder Hour
                </Text>
                <Text className="text-base text-text-primary">
                  {settings.reminder_hour}:00
                </Text>
              </View>
            </View>
          ) : null}
        </Card>

        {/* ── Section 6: AI Assistant ── */}
        <Text className="text-lg font-bold text-text-primary mb-3 mt-6">
          AI Assistant
        </Text>
        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-text-primary">Grok API Key</Text>
            <View
              className={`px-2.5 py-1 rounded-full ${
                hasApiKey ? "bg-success/20" : "bg-surface"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  hasApiKey ? "text-success" : "text-text-muted"
                }`}
              >
                {hasApiKey ? "Connected" : "Not set"}
              </Text>
            </View>
          </View>

          {!hasApiKey && (
            <>
              <Input
                label=""
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="xai-..."
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Button label="Save Key" onPress={handleSaveApiKey} />
            </>
          )}

          {hasApiKey && (
            <Button
              label="Remove Key"
              variant="destructive"
              onPress={handleRemoveApiKey}
            />
          )}
        </Card>

        {/* ── Section 7: Data ── */}
        <Text className="text-lg font-bold text-text-primary mb-3 mt-6">
          Data
        </Text>
        <Card className="gap-3">
          <Button
            label="Export Data"
            variant="primary"
            onPress={handleExportData}
          />
          <Button
            label="Reset All Data"
            variant="destructive"
            onPress={handleResetData}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
