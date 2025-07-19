import { useAuth } from '@/src/context/AuthContext';
import { CSVImportService } from '@/src/services/csvImportService';
import { databaseService, ExtendedPaymentRecord } from '@/src/services/database';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      const result = await CSVImportService.importFromCSV();
      
      if (result.success) {
        Alert.alert('Importación Exitosa', result.message);
        await loadData(); // Recargar datos
      } else {
        Alert.alert('Error en Importación', result.message);
      }
    } catch (error) {
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
      const template = CSVImportService.generateCSVTemplate(type);
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
          3. Guarda el archivo y selecciónalo usando "Seleccionar Archivo"
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
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#006c00',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    paddingVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  userCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userDetails: {
    gap: 6,
  },
  userDetail: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  exportButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  paymentCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
    gap: 6,
  },
  paymentDetail: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  importButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    marginBottom: 16,
  },
  templateButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
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
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  bottomSpace: {
    height: 20,
  },
});
