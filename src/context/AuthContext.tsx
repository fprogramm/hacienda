import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { LoginCredentials, User } from '../types';
import { AppErrors, ErrorHandler } from '../utils/errorHandler';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  finishLoading: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@hacienda_user',
  TOKEN: '@hacienda_token',
  REMEMBER_DATA: '@hacienda_remember',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      ErrorHandler.logError(error as Error, 'AuthContext.checkAuthState');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulación de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos credenciales válidas
      if (credentials.usuario === '32165498' && credentials.contraseña === '123456') {
        const userData: User = {
          name: 'Luis Fernando',
          fullName: 'Luis Fernando Delgado Arboleda',
          cedula: credentials.usuario,
          email: 'luis.delgado@hacienda.gov.co',
        };

        setUser(userData);
        setIsAuthenticated(true);

        // Guardar datos si el usuario lo solicita
        if (credentials.recordarDatos) {
          await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
          await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, 'mock_token_123');
          await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_DATA, 'true');
        }

        return true;
      } else {
        ErrorHandler.showError(AppErrors.INVALID_CREDENTIALS);
        return false;
      }
    } catch (error) {
      ErrorHandler.logError(error as Error, 'AuthContext.login');
      ErrorHandler.showError(AppErrors.NETWORK_ERROR);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Limpiar datos guardados
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REMEMBER_DATA,
      ]);

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      ErrorHandler.logError(error as Error, 'AuthContext.logout');
    } finally {
      setIsLoading(false);
    }
  };

  const finishLoading = () => {
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        user, 
        login, 
        logout, 
        finishLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
