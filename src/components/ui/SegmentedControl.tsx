import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function SegmentedControl({
  options,
  selectedIndex,
  onChange,
}: SegmentedControlProps) {
  return (
    <View className="bg-surface-elevated border border-border rounded-xl p-1 flex-row">
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(index)}
            className={`flex-1 items-center justify-center rounded-lg py-2 ${
              isSelected ? 'bg-primary' : ''
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isSelected ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
