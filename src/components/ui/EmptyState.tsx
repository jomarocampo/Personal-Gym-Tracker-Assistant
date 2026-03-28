import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colorScheme } = useColorScheme();
  const mutedColor = colorScheme === 'dark' ? '#6B7280' : '#9CA3AF';

  return (
    <View className="items-center justify-center py-12 px-6">
      <Ionicons name={icon} size={64} color={mutedColor} style={{ marginBottom: 16 }} />
      <Text className="text-lg font-semibold text-text-primary text-center mb-1">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-sm text-text-muted text-center mb-6">
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}
