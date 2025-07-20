import { useAuth } from '@/src/context/AuthContext';
import { databaseService, ExtendedPaymentRecord } from '@/src/services/database';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

interface User {
  id: number;
  cedula: string;
  name: string;
  fullName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsersScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<ExtendedPaymentRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'payments' | 'import'>('users');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users') {
        await loadUsers();
      } else if (activeTab === 'payments') {
        await loadPayments();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await databaseService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPayments = async () => {
    try {
      const allPayments = await databaseService.getAllPayments();
      setPayments(allPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleImportCSV = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/csv', 'text/comma-separated-values'],
        copyToCacheDirectory: true
      });
      
      if (!result.canceled && result.uri) {
        const fileUri = result.uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: 'utf8' });
        
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              const data = results.data as any[];
              
              if (data.length === 0) {
                Alert.alert('Error', 'El archivo CSV está vacío');
                return;
              }

              // Detectar tipo de datos basado en las columnas
              const columns = Object.keys(data[0]);
              let importResult;

              if (columns.includes('cedula') && columns.includes('fullName')) {
                // Importar usuarios
                importResult = await databaseService.importUsers(data);
              } else if (columns.includes('userId') && columns.includes('referencia')) {
                // Importar transacciones
                importResult = await databaseService.importTransactions(data);
              } else if (columns.includes('userId') && columns.includes('propertyNumber')) {
                // Importar propiedades
                importResult = await databaseService.importProperties(data);
              } else {
                Alert.alert('Error', 'Formato de CSV no reconocido. Verifica que uses la plantilla correcta.');
                return;
              }

              if (importResult.success) {
                Alert.alert('Importación Exitosa', importResult.message);
                await loadData(); // Recargar datos
              } else {
                Alert.alert('Error en Importación', importResult.message);
              }

            } catch (error) {
              console.error('Error processing CSV data:', error);
              Alert.alert('Error', 'Error al procesar los datos del CSV');
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            Alert.alert('Error en Importación', 'No se pudo leer el archivo CSV');
          },
        });
      } else {
        // Usuario canceló la selección
        console.log('File selection cancelled');
      }
    } catch (error) {
      console.error('Error in CSV import:', error);
      Alert.alert('Error', 'No se pudo importar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPayments = async () => {
    try {
      setIsLoading(true);
      const jsonData = await databaseService.exportPaymentsToJSON();
      
      const fileName = `pagos_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, jsonData);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar Pagos'
        });
      } else {
        Alert.alert('Exportación Completa', `Archivo guardado como ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = (type: 'users' | 'properties' | 'transactions' | 'payments') => {
    Alert.alert(
      'Descargar Plantilla',
      `¿Desea descargar la plantilla CSV para ${type}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descargar', onPress: () => downloadTemplate(type) }
      ]
    );
  };

  const downloadTemplate = async (type: 'users' | 'properties' | 'transactions' | 'payments') => {
    try {
      const template = generateCSVTemplate(type);
      const fileName = `plantilla_${type}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, template);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: `Plantilla ${type}`
        });
      } else {
        Alert.alert('Descarga Completa', `Plantilla guardada como ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo descargar la plantilla');
    }
  };

  const generateCSVTemplate = (type: 'users' | 'properties' | 'transactions' | 'payments') => {
    let template = '';
    switch (type) {
      case 'users':
        template = 'cedula,name,fullName,email,phone,password\n';
        template += '12345678,Juan,Juan Pérez García,juan@email.com,3001234567,123456\n';
        template += '87654321,María,María González López,maria@email.com,3007654321,123456\n';
        break;
      case 'properties':
        template = 'userId,propertyNumber,propertyType,address\n';
        template += '1,001,Residencial,Calle 123 #45-67\n';
        template += '1,002,Comercial,Carrera 89 #12-34\n';
        break;
      case 'transactions':
        template = 'userId,referencia,estado,fecha,valor,concepto\n';
        template += '1,REF001,Pendiente,2024-01-15,COP $150000,Administración Enero\n';
        template += '1,REF002,Pendiente,2024-02-15,COP $150000,Administración Febrero\n';
        break;
      case 'payments':
        template = 'userId,transactionId,paymentMethod,amount,adminNotes\n';
        template += '1,1,Transferencia Bancaria,150000,Pago completo\n';
        template += '1,2,Efectivo,150000,Pago en efectivo\n';
        break;
      default:
        throw new Error(`Tipo de plantilla no soportado: ${type}`);
    }
    return template;
  };

  const renderTabButton = (tab: 'users' | 'payments' | 'import', title: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <MaterialIcons name={icon as any} size={20} color={activeTab === tab ? '#059669' : '#6B7280'} />
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderUsersTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Usuarios</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.filter(u => u.isActive).length}</Text>
          <Text style={styles.statLabel}>Activos</Text>
        </View>
      </View>

      {users.map((user, index) => (
        <View key={user.id} style={styles.userCard}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: user.isActive ? '#10B981' : '#EF4444' }]}>
              <Text style={styles.statusText}>{user.isActive ? 'Activo' : 'Inactivo'}</Text>
            </View>
          </View>
          
          <View style={styles.userDetails}>
            <Text style={styles.userDetail}>
              <Text style={styles.bold}>Cédula:</Text> {user.cedula}
            </Text>
            {user.email && (
              <Text style={styles.userDetail}>
                <Text style={styles.bold}>Email:</Text> {user.email}
              </Text>
            )}
            {user.phone && (
              <Text style={styles.userDetail}>
                <Text style={styles.bold}>Teléfono:</Text> {user.phone}
              </Text>
            )}
            <Text style={styles.userDetail}>
              <Text style={styles.bold}>Creado:</Text> {new Date(user.createdAt).toLocaleDateString()}
            </Text>
            {user.lastLogin && (
              <Text style={styles.userDetail}>
                <Text style={styles.bold}>Último acceso:</Text> {new Date(user.lastLogin).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderPaymentsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{payments.length}</Text>
          <Text style={styles.statLabel}>Total Pagos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Monto Total</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={handleExportPayments}>
        <MaterialIcons name="file-download" size={20} color="white" />
        <Text style={styles.exportButtonText}>Exportar Pagos</Text>
      </TouchableOpacity>

      {payments.map((payment, index) => (
        <View key={payment.id} style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentUser}>{payment.userName}</Text>
            <Text style={styles.paymentAmount}>${payment.amount.toLocaleString()}</Text>
          </View>
          
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentDetail}>
              <Text style={styles.bold}>Cédula:</Text> {payment.userCedula}
            </Text>
            <Text style={styles.paymentDetail}>
              <Text style={styles.bold}>Referencia:</Text> {payment.transactionReference}
            </Text>
            <Text style={styles.paymentDetail}>
              <Text style={styles.bold}>Concepto:</Text> {payment.transactionConcept}
            </Text>
            <Text style={styles.paymentDetail}>
              <Text style={styles.bold}>Método:</Text> {payment.paymentMethod}
            </Text>
            <Text style={styles.paymentDetail}>
              <Text style={styles.bold}>Fecha:</Text> {new Date(payment.paymentDate).toLocaleDateString()}
            </Text>
            {payment.adminNotes && (
              <Text style={styles.paymentDetail}>
                <Text style={styles.bold}>Notas:</Text> {payment.adminNotes}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderImportTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Importar Datos desde CSV/JSON</Text>
      
      <TouchableOpacity 
        style={[styles.importButton, isLoading && styles.disabledButton]} 
        onPress={handleImportCSV}
        disabled={isLoading}
      >
        <MaterialIcons name="upload-file" size={24} color="white" />
        <Text style={styles.importButtonText}>
          {isLoading ? 'Importando...' : 'Seleccionar Archivo'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Descargar Plantillas CSV</Text>
      
      <View style={styles.templatesGrid}>
        <TouchableOpacity 
          style={styles.templateButton} 
          onPress={() => handleDownloadTemplate('users')}
        >
          <MaterialIcons name="person" size={24} color="#059669" />
          <Text style={styles.templateText}>Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.templateButton} 
          onPress={() => handleDownloadTemplate('properties')}
        >
          <MaterialIcons name="home" size={24} color="#059669" />
          <Text style={styles.templateText}>Propiedades</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.templateButton} 
          onPress={() => handleDownloadTemplate('transactions')}
        >
          <MaterialIcons name="receipt-long" size={24} color="#059669" />
          <Text style={styles.templateText}>Transacciones</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.templateButton} 
          onPress={() => handleDownloadTemplate('payments')}
        >
          <MaterialIcons name="payment" size={24} color="#059669" />
          <Text style={styles.templateText}>Pagos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instrucciones:</Text>
        <Text style={styles.instructionText}>
          1. Descarga la plantilla CSV del tipo de datos que deseas importar
        </Text>
        <Text style={styles.instructionText}>
          2. Completa la plantilla con tus datos
        </Text>
        <Text style={styles.instructionText}>
          3. Guarda el archivo y selecciónalo usando &quot;Seleccionar Archivo&quot;
        </Text>
        <Text style={styles.instructionText}>
          4. El sistema detectará automáticamente el tipo de datos
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/home')}
        >
          <MaterialIcons name="home" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Administración</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
        >
          <MaterialIcons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {renderTabButton('users', 'Usuarios', 'people')}
        {renderTabButton('payments', 'Pagos', 'payment')}
        {renderTabButton('import', 'Importar', 'upload-file')}
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'payments' && renderPaymentsTab()}
        {activeTab === 'import' && renderImportTab()}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#059669',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  activeTab: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  statCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  userCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 14,
    color: 'white',
  },
  userDetails: {
    padding: 16,
  },
  userDetail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  paymentCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentUser: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  paymentDetails: {
    padding: 16,
  },
  paymentDetail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  exportButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  importButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  templatesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },
  templateButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  templateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  instructionsContainer: {
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 100,
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
});
