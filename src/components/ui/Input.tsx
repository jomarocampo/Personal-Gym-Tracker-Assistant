import React from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  suffix?: string;
  error?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}

export function Input({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType,
  suffix,
  error,
  multiline = false,
  secureTextEntry,
  autoCapitalize,
  autoCorrect,
}: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-sm font-medium text-text-secondary">{label}</Text>
      ) : null}
      <View className="flex-row items-center bg-surface rounded-xl px-4 py-3 border border-border">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          className="flex-1 text-text-primary text-base"
          placeholderTextColor="#9ca3af"
        />
        {suffix ? (
          <Text className="text-text-muted text-sm ml-2">{suffix}</Text>
        ) : null}
      </View>
      {error ? (
        <Text className="text-danger text-xs">{error}</Text>
      ) : null}
    </View>
  );
}
