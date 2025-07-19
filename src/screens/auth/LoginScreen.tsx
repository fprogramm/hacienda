import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
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

import { Header } from '@/src/components/index';
import { useAuth } from '@/src/context/index';
import { FormErrors, LoginCredentials } from '@/src/types/index';
import { ErrorHandler } from '@/src/utils/index';

export default function LoginScreen() {
  const router = useRouter();
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!credentials.usuario.trim() || !credentials.contraseña.trim()) {
      ErrorHandler.showError('Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(credentials.usuario, credentials.contraseña);
      
      if (success) {
        router.replace('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      ErrorHandler.showError('Error al iniciar sesión');
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
      <Header />
      <View style={styles.separator} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            La Hacienda Municipal de Liborina, pone en tus manos esta aplicación para facilitarte el pago de las obligaciones tributarias
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.usuario && styles.inputError]}
              placeholder="Número de cédula"
              value={credentials.usuario}
              onChangeText={(text) => handleInputChange('usuario', text)}
              keyboardType="numeric"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
          {errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.contraseña && styles.inputError]}
              placeholder="Contraseña"
              value={credentials.contraseña}
              onChangeText={(text) => handleInputChange('contraseña', text)}
              secureTextEntry
              editable={!isLoading}
            />
          </View>
          {errors.contraseña && <Text style={styles.errorText}>{errors.contraseña}</Text>}

          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('recordarDatos', !credentials.recordarDatos)}
            disabled={isLoading}
          >
            <MaterialIcons 
              name={credentials.recordarDatos ? "check-box" : "check-box-outline-blank"} 
              size={20} 
              color="#006c00" 
            />
            <Text style={styles.checkboxText}>Recordar mis datos</Text>
          </TouchableOpacity>

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

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
              <Text style={styles.linkText}>Registrarse</Text>
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
    backgroundColor: '#f9fafb',
  },
  separator: {
    height: 2,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkboxText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#820024',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    color: '#006c00',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
