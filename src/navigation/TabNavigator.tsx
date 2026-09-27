import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { BrowseScreen } from '../screens/BrowseScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bookings = useBookingStore((state) => state.bookings);
  const activeBookingsCount = bookings.filter((b) => b.status === 'upcoming').length;

  const bottomInset = Math.max(insets.bottom, 6);
  const tabHeight = Platform.OS === 'ios' ? 54 + bottomInset : 58 + bottomInset;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accentIndigo,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingTop: 6,
          paddingBottom: bottomInset,
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="BrowseTab"
        component={BrowseScreen}
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: 'Lịch đặt',
          tabBarBadge: activeBookingsCount > 0 ? activeBookingsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.accentIndigo,
            fontSize: 10,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
