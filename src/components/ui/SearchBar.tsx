import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
}: SearchBarProps) {
  const { colorScheme } = useColorScheme();
  const mutedColor = colorScheme === 'dark' ? '#6B7280' : '#9CA3AF';

  return (
    <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 py-2">
      <Ionicons name="search-outline" size={20} color={mutedColor} style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="flex-1 text-text-primary text-base"
        placeholderTextColor={mutedColor}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} className="ml-2">
          <Ionicons name="close-circle" size={20} color={mutedColor} />
        </Pressable>
      ) : null}
    </View>
  );
}
