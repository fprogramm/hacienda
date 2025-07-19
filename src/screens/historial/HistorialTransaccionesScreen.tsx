import { useAuth } from '@/src/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TransactionCardProps {
  referencia: string;
  estado: string;
  fecha: string;
  valor: string;
  concepto: string;
  isApproved?: boolean;
}

function TransactionCard({ referencia, estado, fecha, valor, concepto, isApproved = false }: TransactionCardProps) {
  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.referenceText}>Ref: {referencia}</Text>
        <View style={[styles.statusBadge, { backgroundColor: isApproved ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.statusText}>{estado}</Text>
        </View>
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.conceptText}>{concepto}</Text>
        <Text style={styles.dateText}>{fecha}</Text>
        <Text style={styles.amountText}>{valor}</Text>
      </View>
    </View>
  );
}

export default function HistorialTransaccionesScreen() {
  const { getUserTransactions, user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const userTransactions = await getUserTransactions();
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'No se pudieron cargar las transacciones');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const handleDownload = (referencia: string) => {
    Alert.alert(
      'Descargar Comprobante',
      `¿Desea descargar el comprobante de la transacción ${referencia}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descargar', onPress: () => Alert.alert('Descarga', 'Comprobante descargado exitosamente') }
      ]
    );
  };

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
        <Text style={styles.headerTitle}>Historial de Transacciones</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
        >
          <MaterialIcons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            Transacciones de: {user?.fullName}
          </Text>
          <Text style={styles.userInfoSubtext}>
            Cédula: {user?.cedula}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando transacciones...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.noTransactionsContainer}>
            <MaterialIcons name="receipt-long" size={64} color="#9CA3AF" />
            <Text style={styles.noTransactionsText}>
              No se encontraron transacciones
            </Text>
            <Text style={styles.noTransactionsSubtext}>
              Aún no tienes historial de pagos registrados
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsContainer}>
            <Text style={styles.sectionTitle}>
              Total de transacciones: {transactions.length}
            </Text>
            
            {transactions.map((transaction, index) => (
              <View key={index} style={styles.transactionWrapper}>
                <TransactionCard
                  referencia={transaction.referencia}
                  estado={transaction.estado}
                  fecha={transaction.fecha}
                  valor={transaction.valor}
                  concepto={transaction.concepto}
                  isApproved={transaction.isApproved === 1}
                />
                
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownload(transaction.referencia)}
                >
                  <MaterialIcons name="file-download" size={20} color="#006c00" />
                  <Text style={styles.downloadButtonText}>Descargar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Space */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009100',
  },
  header: {
    backgroundColor: '#006c00',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  userInfo: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
  },
  userInfoText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  userInfoSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#374151',
  },
  noTransactionsContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  noTransactionsSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  transactionWrapper: {
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 14,
    color: '#374151',
  },
  statusBadge: {
    padding: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
  },
  transactionDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  conceptText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  downloadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    minWidth: 80,
  },
  downloadButtonText: {
    fontSize: 12,
    color: '#009100',
    fontWeight: '600',
    marginTop: 4,
  },
  bottomSpace: {
    height: 100,
  },
});