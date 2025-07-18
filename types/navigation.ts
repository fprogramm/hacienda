import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';

// Stack Navigator Types
export type RootStackParamList = {
  Home: undefined;
  ImpuestoPredial: undefined;
  BotonPagos: undefined;
  IndustriaComercio: undefined;
  ConsultarPredial: undefined;
  CertificadoPredial: undefined;
  HistorialTransacciones: undefined;
};

// Drawer Navigator Types
export type DrawerParamList = {
  MainStack: undefined;
};

// Auth Stack Types
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
  | 'settings';
