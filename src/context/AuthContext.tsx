import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { User } from '../types';
import { ErrorHandler } from '../utils/errorHandler';

interface AuthContextType {
  user: User | null;
  userId: number | null;
  login: (cedula: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  getUserProperties: () => Promise<any[]>;
  getUserTransactions: () => Promise<any[]>;
  isApiConnected: boolean;
  checkApiConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiConnected, setIsApiConnected] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Verificar conexión con la API
      await checkApiConnection();
      await checkAuthState();
    } catch (error) {
      console.error('Error initializing auth:', error);
      ErrorHandler.handleError(error, 'Error al inicializar autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const checkApiConnection = async () => {
    try {
      const connected = await apiService.checkConnection();
      setIsApiConnected(connected);
      
      if (!connected) {
        console.warn('⚠️ API no disponible. Usando modo offline.');
      } else {
        console.log('✅ Conectado a la API REST exitosamente');
      }
    } catch (error) {
      console.error('❌ Error checking API connection:', error);
      setIsApiConnected(false);
    }
  };

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const userIdData = await AsyncStorage.getItem('userId');
      
      if (userData && userIdData) {
        const parsedUser = JSON.parse(userData);
        const parsedUserId = parseInt(userIdData);
        
        if (isApiConnected) {
          // Verificar que el usuario sigue activo en la API
          const response = await apiService.getUserById(parsedUserId);
          if (response.success && response.data && response.data.isActive) {
            setUser(parsedUser);
            setUserId(parsedUserId);
            console.log(`✅ Usuario autenticado: ${parsedUser.fullName}`);
          } else {
            // Usuario no válido, limpiar datos
            await logout();
          }
        } else {
          // Modo offline: usar datos locales
          setUser(parsedUser);
          setUserId(parsedUserId);
          console.log(`📱 Modo offline: ${parsedUser.fullName}`);
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      await logout();
    }
  };

  const login = async (cedula: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      if (isApiConnected) {
        // Autenticación a través de la API
        const apiUser = await apiService.authenticateUser(cedula, password);
        
        if (apiUser && apiUser.isActive) {
          const userForApp: User = {
            cedula: apiUser.cedula,
            name: apiUser.name,
            fullName: apiUser.fullName,
            email: apiUser.email || '',
            phone: apiUser.phone || '',
            isActive: apiUser.isActive
          };

          setUser(userForApp);
          setUserId(apiUser.id);

          // Guardar en AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(userForApp));
          await AsyncStorage.setItem('userId', apiUser.id.toString());

          console.log(`✅ Login exitoso via API: ${userForApp.fullName}`);
          return true;
        }
      } else {
        // Modo offline: usar credenciales hardcodeadas como fallback
        const offlineUsers = [
          { id: 1, cedula: '32165498', password: '123456', name: 'Luis Fernando', fullName: 'Luis Fernando García', email: 'luis@hacienda.com', phone: '3001234567', isActive: true },
          { id: 2, cedula: '12345678', password: 'admin123', name: 'Admin', fullName: 'Administrador Sistema', email: 'admin@hacienda.com', phone: '3009876543', isActive: true },
          { id: 3, cedula: '87654321', password: 'user123', name: 'María', fullName: 'María González', email: 'maria@hacienda.com', phone: '3005555555', isActive: true }
        ];

        const offlineUser = offlineUsers.find(u => u.cedula === cedula && u.password === password && u.isActive);
        
        if (offlineUser) {
          const userForApp: User = {
            cedula: offlineUser.cedula,
            name: offlineUser.name,
            fullName: offlineUser.fullName,
            email: offlineUser.email,
            phone: offlineUser.phone,
            isActive: offlineUser.isActive
          };

          setUser(userForApp);
          setUserId(offlineUser.id);

          await AsyncStorage.setItem('user', JSON.stringify(userForApp));
          await AsyncStorage.setItem('userId', offlineUser.id.toString());

          console.log(`📱 Login exitoso offline: ${userForApp.fullName}`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      ErrorHandler.handleError(error, 'Error al iniciar sesión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      setUserId(null);
      await AsyncStorage.multiRemove(['user', 'userId', 'remember_data']);
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('Logout error:', error);
      ErrorHandler.handleError(error, 'Error al cerrar sesión');
    }
  };

  const getUserProperties = async (): Promise<any[]> => {
    if (!userId) return [];

    try {
      if (isApiConnected) {
        const response = await apiService.getPropertiesByUser(userId);
        return response.success ? response.data || [] : [];
      } else {
        // Modo offline: retornar datos mock
        return [
          {
            id: 1,
            userId: userId,
            propertyNumber: 'PROP-001',
            propertyType: 'Apartamento',
            address: 'Calle 123 #45-67',
            isActive: true
          }
        ];
      }
    } catch (error) {
      console.error('Error getting user properties:', error);
      return [];
    }
  };

  const getUserTransactions = async (): Promise<any[]> => {
    if (!userId) return [];

    try {
      if (isApiConnected) {
        const response = await apiService.getTransactionsByUser(userId);
        return response.success ? response.data || [] : [];
      } else {
        // Modo offline: retornar datos mock
        return [
          {
            id: 1,
            userId: userId,
            referencia: 'TXN-001',
            estado: 'pendiente',
            fecha: new Date().toISOString().split('T')[0],
            valor: '150000',
            concepto: 'Pago de administración',
            isApproved: false
          }
        ];
      }
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        login,
        logout,
        isLoading,
        getUserProperties,
        getUserTransactions,
        isApiConnected,
        checkApiConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
