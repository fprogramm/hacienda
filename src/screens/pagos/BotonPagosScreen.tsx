import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OptionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}

function OptionCard({ title, subtitle, icon, onPress }: OptionCardProps) {
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon as any} size={24} color="#006c00" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
}

export default function BotonPagosScreen() {
  const options = [
    {
      title: 'Historial de Transacciones',
      subtitle: 'Aquí puedes descargar los comprobantes de pago o consultar el estado de tus transacciones',
      icon: 'history',
      onPress: () => router.push('/historial-transacciones'),
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
        <Text style={styles.headerTitle}>Botón de Pagos</Text>
        <View style={styles.spacer} />
      </View>

      {/* Main Card */}
      <View style={styles.mainCard}>
        <View style={styles.mainCardContent}>
          <View style={styles.mainIconContainer}>
            <MaterialIcons name="attach-money" size={32} color="white" />
          </View>
          <View style={styles.mainTextContainer}>
            <Text style={styles.mainTitle}>Botón de Pagos</Text>
            <Text style={styles.mainSubtitle}>Pagos e historial</Text>
          </View>
        </View>
      </View>

      {/* Options */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <OptionCard key={index} {...option} />
          ))}
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
  mainCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainCardContent: {
    backgroundColor: '#820025',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  mainIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mainTextContainer: {
    flex: 1,
  },
  mainTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mainSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    padding: 16,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f0f9ff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006c00',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});