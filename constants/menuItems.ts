import { MenuItem, MainStackNavigationProp } from '../types';

export const createMenuItems = (navigation: MainStackNavigationProp): MenuItem[] => [
  {
    id: '1',
    title: 'Impuesto Predial',
    subtitle: 'Consultas, pagos y certificados prediales',
    icon: 'home',
    color: 'from-purple-600 to-purple-700',
    onPress: () => navigation.navigate('ImpuestoPredial'),
  },
  {
    id: '2',
    title: 'Botón de Pagos',
    subtitle: 'Realiza pagos y consulta tu historial',
    icon: 'attach-money',
    color: 'from-purple-600 to-purple-700',
    onPress: () => navigation.navigate('BotonPagos'),
  },
  {
    id: '3',
    title: 'Industria y Comercio',
    subtitle: 'Certificados comerciales y empresariales',
    icon: 'business',
    color: 'from-purple-600 to-purple-700',
    onPress: () => navigation.navigate('IndustriaComercio'),
  },
];