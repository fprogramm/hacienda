import { useAuth } from '@/src/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const { getUserProperties, user } = useAuth();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const years = ['2025', '2024', '2023', '2022', '2021'];

  useEffect(() => {
    loadUserProperties();
  }, []);

  const loadUserProperties = async () => {
    try {
      const properties = await getUserProperties();
      setUserProperties(properties);
      if (properties.length > 0) {
        setSelectedProperty(`${properties[0].propertyNumber} - ${properties[0].propertyType}`);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const getPropertyOptions = () => {
    return userProperties.map(prop => `${prop.propertyNumber} - ${prop.propertyType}`);
  };

  const getSelectedPropertyData = () => {
    const propertyNumber = selectedProperty.split(' - ')[0];
    return userProperties.find(prop => prop.propertyNumber === propertyNumber);
  };

  const handleConsultar = () => {
    if (!selectedProperty) {
      Alert.alert('Error', 'Por favor seleccione una propiedad');
      return;
    }

    setIsLoading(true);
    
    // Simular consulta
    setTimeout(() => {
      setShowResults(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleDownload = () => {
    const propertyData = getSelectedPropertyData();
    Alert.alert(
      'Descargar Recibo', 
      `¿Desea descargar el recibo del predio ${propertyData?.propertyNumber}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descargar', onPress: () => Alert.alert('Descarga', 'Recibo descargado exitosamente') }
      ]
    );
  };

  const selectedPropertyData = getSelectedPropertyData();

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
        <Text style={styles.headerTitle}>Consultar Predial</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            Consulte el estado de su impuesto predial
          </Text>

          {userProperties.length === 0 ? (
            <View style={styles.noPropertiesContainer}>
              <Text style={styles.noPropertiesText}>
                No se encontraron propiedades asociadas a su cuenta
              </Text>
            </View>
          ) : (
            <>
              <Dropdown
                label="Seleccionar Propiedad"
                value={selectedProperty}
                options={getPropertyOptions()}
                onSelect={setSelectedProperty}
              />

              <Dropdown
                label="Año"
                value={selectedYear}
                options={years}
                onSelect={setSelectedYear}
              />

              <TouchableOpacity 
                style={styles.consultarButton}
                onPress={handleConsultar}
                disabled={isLoading}
              >
                <Text style={styles.consultarButtonText}>
                  {isLoading ? 'Consultando...' : 'Consultar'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {showResults && selectedPropertyData && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Resultados de la Consulta</Text>
            
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyInfoTitle}>Información de la Propiedad</Text>
              <Text style={styles.propertyInfoText}>
                <Text style={styles.bold}>Predio:</Text> {selectedPropertyData.propertyNumber}
              </Text>
              <Text style={styles.propertyInfoText}>
                <Text style={styles.bold}>Tipo:</Text> {selectedPropertyData.propertyType}
              </Text>
              <Text style={styles.propertyInfoText}>
                <Text style={styles.bold}>Dirección:</Text> {selectedPropertyData.address}
              </Text>
              <Text style={styles.propertyInfoText}>
                <Text style={styles.bold}>Propietario:</Text> {user?.fullName}
              </Text>
            </View>

            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Concepto</Text>
                <Text style={styles.tableHeaderText}>Fecha de{'\n'}Expedición</Text>
                <Text style={styles.tableHeaderText}>Fecha de{'\n'}Vencimiento</Text>
                <View style={styles.tableHeaderAction} />
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  Predio: {selectedPropertyData.propertyNumber}{'\n'}{selectedPropertyData.propertyType}
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
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  noPropertiesContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noPropertiesText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
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
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  propertyInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  propertyInfoTitle: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  propertyInfoText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  bold: {
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