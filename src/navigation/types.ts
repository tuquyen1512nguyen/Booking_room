import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  BrowseTab: undefined;
  BookingsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  RoomDetail: { roomId: string };
  Booking: { roomId: string; initialDate?: string };
  Favorites: undefined;
  Notifications: undefined;
  FilterModal: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
