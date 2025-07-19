import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TransactionCardProps {
  referencia: string;
  estado: string;
  fecha: string;
  valor: string;
  isApproved?: boolean;
}

function TransactionCard({ referencia, estado, fecha, valor, isApproved = false }: TransactionCardProps) {
  const handleDownload = () => {
    Alert.alert('Descarga', `Descargando comprobante de la transacción ${referencia}...`);
  };

  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionContent}>
        <Text style={styles.referenceText}>
          <Text style={styles.referenceLabel}>Referencia: </Text>
          {referencia}
        </Text>
        <Text style={[styles.statusText, isApproved ? styles.approvedStatus : styles.rejectedStatus]}>
          Estado: {estado}
        </Text>
        <Text style={styles.dateText}>Fecha: {fecha}</Text>
        <Text style={styles.valueText}>Valor: {valor}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={handleDownload}
      >
        <MaterialIcons name="file-download" size={24} color="#009100" />
        <Text style={styles.downloadText}>Descargar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HistorialTransaccionesScreen() {
  const transactions = [
    {
      referencia: '000131717545562O',
      estado: 'Rechazada',
      fecha: '2017-09-06 13:25:24',
      valor: 'COP $73,375.00',
      isApproved: false,
    },
    {
      referencia: '000131717545562O',
      estado: 'Rechazada',
      fecha: '2017-09-06 11:29:06',
      valor: 'COP $73,375.00',
      isApproved: false,
    },
    {
      referencia: '000131717545562O',
      estado: 'Rechazada',
      fecha: '2017-09-06 10:59:11',
      valor: 'COP $73,375.00',
      isApproved: false,
    },
    {
      referencia: '000131717545562O',
      estado: 'Rechazada',
      fecha: '2017-09-06 10:56:52',
      valor: 'COP $73,375.00',
      isApproved: false,
    },
    {
      referencia: '000131717545562O',
      estado: 'Rechazada',
      fecha: '2017-08-02 13:54:06',
      valor: 'COP $73,375.00',
      isApproved: false,
    },
    {
      referencia: '000141217148344Z',
      estado: 'Rechazada',
      fecha: '2012-12-09 14:14:40',
      valor: 'COP $16,882.00',
      isApproved: false,
    },
    {
      referencia: '000131117479050S',
      estado: 'Aprobada',
      fecha: '2011-08-03 12:26:37',
      valor: 'COP $16,882.00',
      isApproved: true,
    },
  ];

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
        <Text style={styles.headerTitle}>Historial de pagos</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.underline} />

      {/* Transactions List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.transactionsContainer}>
          {transactions.map((transaction, index) => (
            <TransactionCard key={index} {...transaction} />
          ))}
        </View>
        
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
  spacer: {
    width: 40,
  },
  underline: {
    height: 2,
    backgroundColor: 'white',
    marginHorizontal: 60,
    marginTop: 8,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  transactionsContainer: {
    paddingHorizontal: 16,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionContent: {
    flex: 1,
  },
  referenceText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  referenceLabel: {
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  approvedStatus: {
    color: '#059669',
  },
  rejectedStatus: {
    color: '#dc2626',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  downloadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    minWidth: 80,
  },
  downloadText: {
    fontSize: 12,
    color: '#009100',
    fontWeight: '600',
    marginTop: 4,
  },
  bottomSpace: {
    height: 100,
  },
});