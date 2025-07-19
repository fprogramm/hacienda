import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { databaseService } from '../services/database';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await databaseService.initializeDatabase();
      await checkAuthState();
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const userIdData = await AsyncStorage.getItem('userId');
      
      if (userData && userIdData) {
        const parsedUser = JSON.parse(userData);
        const parsedUserId = parseInt(userIdData);
        
        // Verificar que el usuario sigue activo en la base de datos
        const dbUser = await databaseService.getUserByCedula(parsedUser.cedula);
        if (dbUser) {
          setUser(parsedUser);
          setUserId(parsedUserId);
        } else {
          // Usuario no existe o no está activo, limpiar datos
          await AsyncStorage.multiRemove(['user', 'userId', 'token', 'remember_data']);
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };

  const login = async (cedula: string, password: string): Promise<boolean> => {
    try {
      const dbUser = await databaseService.authenticateUser(cedula, password);
      
      if (dbUser) {
        const appUser = databaseService.convertToAppUser(dbUser);
        setUser(appUser);
        setUserId(dbUser.id);
        
        // Guardar en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(appUser));
        await AsyncStorage.setItem('userId', dbUser.id.toString());
        await AsyncStorage.setItem('token', 'dummy-token');
        
        ErrorHandler.showSuccess(`¡Bienvenido ${appUser.fullName}!`);
        return true;
      } else {
        ErrorHandler.showError('Credenciales inválidas');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      ErrorHandler.showError('Error al iniciar sesión');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      setUserId(null);
      await AsyncStorage.multiRemove(['user', 'userId', 'token', 'remember_data']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserProperties = async (): Promise<any[]> => {
    if (!userId) return [];
    
    try {
      return await databaseService.getUserProperties(userId);
    } catch (error) {
      console.error('Error getting user properties:', error);
      return [];
    }
  };

  const getUserTransactions = async (): Promise<any[]> => {
    if (!userId) return [];
    
    try {
      return await databaseService.getUserTransactions(userId);
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  };

  const value: AuthContextType = {
    user,
    userId,
    login,
    logout,
    isLoading,
    getUserProperties,
    getUserTransactions,
  };

  return (
    <AuthContext.Provider value={value}>
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
