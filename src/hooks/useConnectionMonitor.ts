import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useConnectionMonitor = () => {
  const { isApiConnected, checkApiConnection } = useAuth();
  const [isNetworkConnected, setIsNetworkConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Suscribirse a cambios en la conexión de red
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsNetworkConnected(state.isConnected ?? false);
      setConnectionType(state.type);
      
      console.log(`📶 Red: ${state.isConnected ? 'Conectada' : 'Desconectada'} (${state.type})`);
      
      // Si se recupera la conexión de red, verificar la API
      if (state.isConnected && !isApiConnected) {
        console.log('🔄 Red recuperada, verificando API...');
        setTimeout(() => {
          checkApiConnection();
        }, 2000); // Esperar 2 segundos antes de verificar
      }
    });

    return () => unsubscribe();
  }, [isApiConnected, checkApiConnection]);

  return {
    isNetworkConnected,
    isApiConnected,
    connectionType,
    hasFullConnection: isNetworkConnected && isApiConnected,
  };
};
