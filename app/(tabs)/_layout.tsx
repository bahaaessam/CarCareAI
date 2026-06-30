import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="chart.bar.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="fuel"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="fuel-history"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="oil-change"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
      href: null,
     }}
      />
      <Tabs.Screen
        name="oil-status"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="car-info"
        options={{ href: null }}
      />
<Tabs.Screen
  name="upcoming-services"
  options={{
    href: null,
  }}
/>

      <Tabs.Screen
        name="maintenance"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="maintenance-history"
        options={{ href: null }}
      />
    </Tabs>
  );
}