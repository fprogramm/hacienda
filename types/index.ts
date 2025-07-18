import { MaterialIconName } from './navigation';

export interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: MaterialIconName;
  color: string;
  onPress: () => void;
}

export interface User {
  name: string;
  fullName: string;
  cedula?: string;
  email?: string;
}

export interface PredialInfo {
  numeroMatricula: string;
  direccion: string;
  propietario: string;
  avaluo: number;
  impuesto: number;
  estado: 'Al día' | 'En mora' | 'Pendiente';
}

export interface Transaction {
  id: string;
  fecha: string;
  concepto: string;
  valor: number;
  estado: 'Exitosa' | 'Pendiente' | 'Fallida';
  referencia: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface LoginCredentials {
  usuario: string;
  contraseña: string;
  recordarDatos: boolean;
}

// Re-export navigation types
export * from './navigation';