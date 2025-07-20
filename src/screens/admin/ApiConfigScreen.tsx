import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';

interface ApiStats {
  totalUsers: number;
  totalProperties: number;
  totalTransactions: number;
  totalPayments: number;
  activeUsers: number;
  pendingTransactions: number;
  completedPayments: number;
}

export const ApiConfigScreen: React.FC = () => {
  const { isApiConnected, checkApiConnection } = useAuth();
  const [apiUrl, setApiUrl] = useState('http://localhost:3000/api');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [lastSync, setLastSync] = useState<string>('');

  useEffect(() => {
    if (isApiConnected) {
      loadApiStats();
    }
  }, [isApiConnected]);

  const loadApiStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
        setLastSync(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Error loading API stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setIsLoading(true);
      
      // Actualizar URL de la API
      apiService.setBaseUrl(apiUrl);
      
      // Verificar conexión
      await checkApiConnection();
      
      if (isApiConnected) {
        Alert.alert(
          '✅ Conexión Exitosa',
          'La aplicación se ha conectado correctamente a la API REST.',
          [{ text: 'OK' }]
        );
        await loadApiStats();
      } else {
        Alert.alert(
          '❌ Error de Conexión',
          'No se pudo conectar a la API. Verifica que el servidor esté ejecutándose y la URL sea correcta.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        '❌ Error',
        'Error al probar la conexión: ' + (error instanceof Error ? error.message : 'Error desconocido'),
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.exportAllData();
      
      if (response.success && response.data) {
        Alert.alert(
          '📊 Datos Exportados',
          `Exportación exitosa:\n• ${response.data.users.length} usuarios\n• ${response.data.properties.length} propiedades\n• ${response.data.transactions.length} transacciones\n• ${response.data.payments.length} pagos`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('❌ Error', 'No se pudieron exportar los datos', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert(
        '❌ Error',
        'Error al exportar datos: ' + (error instanceof Error ? error.message : 'Error desconocido'),
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const ConnectionStatus = () => (
    <View style={[styles.statusCard, isApiConnected ? styles.connected : styles.disconnected]}>
      <Text style={styles.statusTitle}>
        {isApiConnected ? '🟢 API Conectada' : '🔴 API Desconectada'}
      </Text>
      <Text style={styles.statusSubtitle}>
        {isApiConnected 
          ? 'La aplicación está sincronizada con el servidor'
          : 'Funcionando en modo offline'
        }
      </Text>
      {lastSync && (
        <Text style={styles.lastSync}>Última sincronización: {lastSync}</Text>
      )}
    </View>
  );

  const StatsCard = ({ title, value, subtitle }: { title: string; value: number; subtitle?: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Configuración API" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ConnectionStatus />

        {/* Configuración de URL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 URL del Servidor API</Text>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="http://localhost:3000/api"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={testConnection}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>🔄 Probar Conexión</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Estadísticas de la API */}
        {isApiConnected && stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Estadísticas del Servidor</Text>
            
            <View style={styles.statsGrid}>
              <StatsCard title="Usuarios" value={stats.totalUsers} subtitle={`${stats.activeUsers} activos`} />
              <StatsCard title="Propiedades" value={stats.totalProperties} />
              <StatsCard title="Transacciones" value={stats.totalTransactions} subtitle={`${stats.pendingTransactions} pendientes`} />
              <StatsCard title="Pagos" value={stats.totalPayments} subtitle={`${stats.completedPayments} completados`} />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={loadApiStats}
              disabled={isLoading}
            >
              <Text style={styles.buttonTextSecondary}>🔄 Actualizar Estadísticas</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Acciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Acciones</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.exportButton]}
            onPress={exportData}
            disabled={!isApiConnected || isLoading}
          >
            <Text style={styles.buttonText}>📤 Exportar Todos los Datos</Text>
          </TouchableOpacity>
        </View>

        {/* Información */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Información</Text>
          <Text style={styles.infoText}>
            • La API REST permite acceder a los datos desde aplicaciones externas como Postman{'\n'}
            • En modo offline, la app usa datos locales limitados{'\n'}
            • Para usar la API, asegúrate de que el servidor esté ejecutándose{'\n'}
            • Comando: cd api-server && npm start
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  connected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
    borderWidth: 2,
  },
  disconnected: {
    backgroundColor: '#ffeaea',
    borderColor: '#f44336',
    borderWidth: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  lastSync: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#006c00',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#006c00',
  },
  exportButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#006c00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006c00',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  infoSection: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
