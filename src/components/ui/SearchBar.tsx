import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  return (
    <View className="flex-row items-center bg-surface rounded-xl px-3 py-2">
      <Ionicons name="search-outline" size={20} className="text-text-muted mr-2" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="flex-1 text-text-primary text-base"
        placeholderTextColor="#9ca3af"
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} className="ml-2">
          <Ionicons name="close-circle" size={20} className="text-text-muted" />
        </Pressable>
      ) : null}
    </View>
  );
}
