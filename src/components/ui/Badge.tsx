import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-muted',
  primary: 'bg-primary/15',
  success: 'bg-success/15',
  warning: 'bg-warning/15',
  danger: 'bg-danger/15',
};

const variantTextClasses: Record<BadgeVariant, string> = {
  default: 'text-text-muted',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View className={`rounded-full px-2.5 py-0.5 ${variantClasses[variant]}`}>
      <Text className={`text-xs font-medium ${variantTextClasses[variant]}`}>
        {label}
      </Text>
    </View>
  );
}
