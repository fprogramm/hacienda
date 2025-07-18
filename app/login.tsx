import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { FormErrors, LoginCredentials, ScreenProps } from '@/types';
import { ErrorHandler } from '@/utils/errorHandler';
import { validateLoginForm } from '@/utils/validation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// TypeScript interfaces for the login screen
interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginScreenState {
  formData: LoginFormData;
  isLoading: boolean;
  errors: {
    username?: string;
    password?: string;
    general?: string;
  };
}

export default function LoginScreen({ navigation }: ScreenProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    usuario: '',
    contraseña: '',
    recordarDatos: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Validar formulario
      const validationErrors = validateLoginForm(credentials);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Intentar login
      const success = await login(credentials);
      if (success) {
        ErrorHandler.showSuccess('¡Bienvenido a Hacienda Liborina!');
      }
    } catch (error) {
      ErrorHandler.logError(error as Error, 'LoginScreen.handleLogin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    ErrorHandler.showWarning('Funcionalidad próximamente disponible. Contacte al administrador del sistema.');
  };

  const handleRegister = () => {
    ErrorHandler.showWarning('Para registrarse, diríjase a las oficinas de la Hacienda Municipal.');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <Header/>

      {/* White separator line */}
      <View style={styles.separator} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            La Hacienda Municipal pone en tus manos esta aplicación para facilitarte el pago de las obligaciones tributarias
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.usuario && styles.inputError]}
              placeholder="Cédula/NIT/Usuario"
              placeholderTextColor="#999"
              value={credentials.usuario}
              onChangeText={(text) => handleInputChange('usuario', text)}
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.contraseña && styles.inputError]}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={credentials.contraseña}
              onChangeText={(text) => handleInputChange('contraseña', text)}
              secureTextEntry
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.contraseña && <Text style={styles.errorText}>{errors.contraseña}</Text>}
          </View>

          {/* Remember Data */}
          <TouchableOpacity 
            style={styles.rememberContainer}
            onPress={() => handleInputChange('recordarDatos', !credentials.recordarDatos)}
            disabled={isLoading}
          >
            <View style={[styles.checkbox, credentials.recordarDatos && styles.checkboxSelected]}>
              {credentials.recordarDatos && (
                <MaterialIcons name="check" size={16} color="white" />
              )}
            </View>
            <Text style={styles.rememberText}>Recordar mis datos</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          {/* Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
              <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#820024',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006c00', // O el color de tu preferencia
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  menuButton: {
    position: 'absolute',
    left: 16,
    top: 48,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  separator: {
    height: 5,
    backgroundColor: 'white',
  },
  infoSection: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 0,
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
    elevation: 0,
    shadowColor: 'transparent',
  },
  infoText: {
    fontSize: 16,
    color: '#f3f3f3',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  formSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#006c00',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#006c00',
  },
  rememberText: {
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#006c00',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#006c00',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006c00',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 14,
    color: '#666',
  },
  linksContainer: {
    alignItems: 'center',
  },
  linkText: {
    color: '#006c00',
    fontSize: 16,
    marginVertical: 8,
    textDecorationLine: 'underline',
  },

});