import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { RoomDetailScreen } from '../screens/RoomDetailScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
