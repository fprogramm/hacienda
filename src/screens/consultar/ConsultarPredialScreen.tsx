import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

function Dropdown({ label, value, options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownOption}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ConsultarPredialScreen() {
  const [periodo, setPeriodo] = useState('1er trimestre');
  const [año, setAño] = useState('2025');
  const [showResults, setShowResults] = useState(false);

  const periodos = ['1er trimestre', '2do trimestre', '3er trimestre', '4to trimestre'];
  const años = ['2025', '2024', '2023', '2022', '2021'];

  const handleConsultar = () => {
    setShowResults(true);
    // Aquí iría la lógica para consultar los datos reales
  };

  const handleDownload = () => {
    Alert.alert('Descarga', 'Descargando documento de cobro predial...');
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
        <Text style={styles.headerTitle}>Hacienda Liborina</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Section */}
        <View style={styles.mainSection}>
          <Text style={styles.mainTitle}>
            Consulte su{'\n'}documento de{'\n'}cobro predial
          </Text>
          <View style={styles.underline} />
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Dropdown
            label="Período:"
            value={periodo}
            options={periodos}
            onSelect={setPeriodo}
          />

          <Dropdown
            label="Año:"
            value={año}
            options={años}
            onSelect={setAño}
          />

          <TouchableOpacity
            style={styles.consultarButton}
            onPress={handleConsultar}
          >
            <Text style={styles.consultarButtonText}>Consultar</Text>
          </TouchableOpacity>
        </View>

        {/* Results Table */}
        {showResults && (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Descripción</Text>
              <Text style={styles.tableHeaderText}>Fecha de{'\n'}Expedición</Text>
              <Text style={styles.tableHeaderText}>Fecha de{'\n'}Vencimiento</Text>
              <View style={styles.tableHeaderAction} />
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                Predio: 890628{'\n'}RESIDE
              </Text>
              <Text style={styles.tableCell}>2025-01-21</Text>
              <Text style={styles.tableCell}>2025-03-07</Text>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownload}
              >
                <MaterialIcons name="file-download" size={24} color="#006c00" />
              </TouchableOpacity>
            </View>
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
  spacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  mainSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  mainTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
  },
  underline: {
    width: 200,
    height: 2,
    backgroundColor: 'white',
    marginTop: 16,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 1000,
  },
  dropdownLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  consultarButton: {
    backgroundColor: '#820025',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  consultarButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableHeader: {
    backgroundColor: '#006c00',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableHeaderAction: {
    width: 40,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
    textAlign: 'center',
  },
  downloadButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpace: {
    height: 100,
  },
});