import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Stack Navigator Types (Expo Router)
export type RootStackParamList = {
  index: undefined;
  login: undefined;
  home: undefined;
  'consultar-predial': undefined;
  'realizar-pagos': undefined;
  'historial-transacciones': undefined;
  'mi-perfil': undefined;
  '+not-found': undefined;
};

// Legacy types (mantener por compatibilidad)
export type DrawerParamList = {
  MainStack: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

// Navigation Props Types
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AppDrawerNavigationProp = DrawerNavigationProp<DrawerParamList>;

export type MainStackNavigationProp = CompositeNavigationProp<
  RootStackNavigationProp,
  AppDrawerNavigationProp
>;

// Screen Props Types
export interface ScreenProps {
  navigation: MainStackNavigationProp;
}

// Material Icons Type
export type MaterialIconName = 
  | 'home'
  | 'attach-money'
  | 'business'
  | 'search'
  | 'description'
  | 'history'
  | 'menu'
  | 'chevron-right'
  | 'check'
  | 'arrow-back'
  | 'account-balance'
  | 'person'
  | 'logout'
  | 'settings'
  | 'receipt-long'
  | 'payment'
  | 'close'
  | 'contact-phone'
  | 'share'
  | 'exit-to-app'
  | 'keyboard-arrow-up'
  | 'keyboard-arrow-down'
  | 'file-download';
