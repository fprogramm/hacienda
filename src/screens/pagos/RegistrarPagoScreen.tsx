import { useAuth } from '@/src/context/AuthContext';
import { databaseService } from '@/src/services/database';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Transaction {
  id: number;
  referencia: string;
  concepto: string;
  valor: string;
  fecha: string;
  estado: string;
}

export default function RegistrarPagoScreen() {
  const { getUserTransactions, userId, user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    'Efectivo',
    'Transferencia Bancaria',
    'Tarjeta de Crédito',
    'Tarjeta de Débito',
    'PSE',
    'Consignación'
  ];

  useEffect(() => {
    loadPendingTransactions();
  }, []);

  const loadPendingTransactions = async () => {
    try {
      const userTransactions = await getUserTransactions();
      // Filtrar solo transacciones pendientes
      const pendingTransactions = userTransactions.filter(t => 
        t.estado !== 'Aprobada' && t.isApproved !== 1
      );
      setTransactions(pendingTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'No se pudieron cargar las transacciones');
    }
  };

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    // Extraer el valor numérico del string (ej: "COP $73,375.00" -> "73375")
    const numericValue = transaction.valor.replace(/[^\d]/g, '');
    setAmount(numericValue);
  };

  const handleRegisterPayment = async () => {
    if (!selectedTransaction) {
      Alert.alert('Error', 'Por favor seleccione una transacción');
      return;
    }

    if (!paymentMethod.trim()) {
      Alert.alert('Error', 'Por favor seleccione un método de pago');
      return;
    }

    if (!amount.trim() || isNaN(Number(amount))) {
      Alert.alert('Error', 'Por favor ingrese un monto válido');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'Usuario no identificado');
      return;
    }

    Alert.alert(
      'Confirmar Pago',
      `¿Está seguro de registrar el pago de $${Number(amount).toLocaleString()} para la transacción ${selectedTransaction.referencia}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => processPayment() }
      ]
    );
  };

  const processPayment = async () => {
    if (!selectedTransaction || !userId) return;

    setIsLoading(true);

    try {
      const result = await databaseService.registerPayment(
        userId,
        selectedTransaction.id,
        {
          paymentMethod,
          amount: Number(amount),
          adminNotes: notes.trim() || undefined
        }
      );

      if (result.success) {
        Alert.alert(
          'Pago Registrado',
          result.message,
          [
            {
              text: 'Ver Historial',
              onPress: () => router.push('/historial-transacciones')
            },
            {
              text: 'Registrar Otro',
              onPress: () => {
                setSelectedTransaction(null);
                setPaymentMethod('');
                setAmount('');
                setNotes('');
                loadPendingTransactions();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message);
      }

    } catch (error) {
      console.error('Error registering payment:', error);
      Alert.alert('Error', 'No se pudo registrar el pago');
    } finally {
      setIsLoading(false);
    }
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
        <Text style={styles.headerTitle}>Registrar Pago</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            Registrar pago para: {user?.fullName}
          </Text>
          <Text style={styles.userInfoSubtext}>
            Cédula: {user?.cedula}
          </Text>
        </View>

        {/* Selección de Transacción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Seleccionar Transacción Pendiente</Text>
          
          {transactions.length === 0 ? (
            <View style={styles.noTransactionsContainer}>
              <MaterialIcons name="check-circle" size={64} color="#10B981" />
              <Text style={styles.noTransactionsText}>
                No tienes transacciones pendientes
              </Text>
              <Text style={styles.noTransactionsSubtext}>
                Todas tus obligaciones están al día
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  style={[
                    styles.transactionCard,
                    selectedTransaction?.id === transaction.id && styles.selectedTransaction
                  ]}
                  onPress={() => handleTransactionSelect(transaction)}
                >
                  <View style={styles.transactionHeader}>
                    <Text style={styles.transactionRef}>Ref: {transaction.referencia}</Text>
                    <Text style={styles.transactionAmount}>{transaction.valor}</Text>
                  </View>
                  <Text style={styles.transactionConcept}>{transaction.concepto}</Text>
                  <Text style={styles.transactionDate}>{transaction.fecha}</Text>
                  
                  {selectedTransaction?.id === transaction.id && (
                    <View style={styles.selectedIndicator}>
                      <MaterialIcons name="check-circle" size={20} color="#10B981" />
                      <Text style={styles.selectedText}>Seleccionada</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Detalles del Pago */}
        {selectedTransaction && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Detalles del Pago</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Método de Pago</Text>
              <View style={styles.methodsGrid}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodButton,
                      paymentMethod === method && styles.selectedMethod
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <Text style={[
                      styles.methodText,
                      paymentMethod === method && styles.selectedMethodText
                    ]}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Monto Pagado</Text>
              <TextInput
                style={styles.textInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="Ingrese el monto"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Notas Adicionales (Opcional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Ej: Número de comprobante, observaciones..."
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.disabledButton]}
              onPress={handleRegisterPayment}
              disabled={isLoading}
            >
              <MaterialIcons name="payment" size={24} color="white" />
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Registrando...' : 'Registrar Pago'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  userInfo: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
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
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 16,
  },
  noTransactionsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noTransactionsText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginTop: 8,
  },
  noTransactionsSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedTransaction: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionRef: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 16,
    color: '#059669',
    fontWeight: 'bold',
  },
  transactionConcept: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  selectedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  selectedMethod: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  methodText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedMethodText: {
    color: '#059669',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 20,
  },
});
