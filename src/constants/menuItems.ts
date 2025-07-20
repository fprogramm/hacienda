import { MenuItem } from '@/src/types';
import { router } from 'expo-router';

export const createMenuItems = (navigation?: any): MenuItem[] => [
  {
    id: '1',
    title: 'Consultar Impuestos',
    subtitle: 'Revisa el estado de tus impuestos prediales y vehículos',
    icon: 'receipt-long',
    color: '#2196F3',
    onPress: () => {
      router.push('/consultar-predial');
    },
  },
  {
    id: '2',
    title: 'Realizar Pagos',
    subtitle: 'Paga tus impuestos de forma rápida y segura',
    icon: 'payment',
    color: '#4CAF50',
    onPress: () => {
      router.push('/realizar-pagos');
    },
  },
  {
    id: '3',
    title: 'Historial de Pagos',
    subtitle: 'Consulta todos tus pagos realizados anteriormente',
    icon: 'history',
    color: '#FF9800',
    onPress: () => {
      router.push('/historial-transacciones');
    },
  },
  {
    id: '4',
    title: 'Mi Perfil',
    subtitle: 'Administra tu información personal y configuración',
    icon: 'person',
    color: '#9C27B0',
    onPress: () => {
      router.push('/mi-perfil');
    },
  },
  {
    id: '5',
    title: 'Configuración API',
    subtitle: 'Conectar con servidor REST y sincronizar datos',
    icon: 'cloud-sync',
    color: '#607D8B',
    onPress: () => {
      router.push('/api-config' as any);
    },
  },
];
