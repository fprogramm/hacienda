import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useAuth } from '@/src/context/AuthContext';
import { ErrorHandler } from '@/src/utils/index';

const { width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = screenWidth * 0.8; // 80% del ancho de la pantalla

interface HeaderMenuProps {
  // Puedes agregar props aquí si necesitas pasar datos desde el componente padre
}

export default function HeaderMenu({ }: HeaderMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const { logout } = useAuth();

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuOpen(false);
    });
  };

  const handleContacto = () => {
    closeMenu();
    setTimeout(() => {
      ErrorHandler.showSuccess('Contacto: Hacienda Municipal de Liborina\nTeléfono: (123) 456-7890\nEmail: hacienda@liborina.gov.co');
    }, 300);
  };

  const handleRedesSociales = () => {
    closeMenu();
    setTimeout(() => {
      ErrorHandler.showSuccess('Síguenos en nuestras redes sociales:\n• Facebook: @HaciendaLiborina\n• Instagram: @hacienda_liborina\n• Twitter: @HaciendaLib');
    }, 300);
  };

  const handleCerrarSesion = () => {
    closeMenu();
    setTimeout(() => {
      Alert.alert(
        'Cerrar Sesión',
        '¿Está seguro que desea cerrar su sesión?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Cerrar Sesión',
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
                router.replace('/login');
                ErrorHandler.showSuccess('Sesión cerrada exitosamente');
              } catch (error) {
                ErrorHandler.showError('Error al cerrar sesión');
              }
            },
          },
        ]
      );
    }, 300);
  };

  const handleSalir = () => {
    closeMenu();
    setTimeout(() => {
      Alert.alert(
        'Salir de la Aplicación',
        '¿Está seguro que desea salir de la aplicación?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]
      );
    }, 300);
  };

  return (
    <>
      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <MaterialIcons name="menu" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal para el menú */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalContainer}>
          {/* Dark Overlay */}
          <TouchableOpacity 
            style={styles.overlay} 
            onPress={closeMenu}
            activeOpacity={1}
          />
          
          {/* Drawer Menu */}
          <Animated.View 
            style={[
              styles.drawer,
              {
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.drawerTitle}>Menú</Text>
            </View>

            {/* Drawer Content */}
            <View style={styles.drawerContent}>
              <TouchableOpacity style={styles.drawerItem} onPress={handleContacto}>
                <MaterialIcons name="contact-phone" size={24} color="#006c00" />
                <Text style={styles.drawerItemText}>Contacto</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
              
              <View style={styles.separator} />
              
              <TouchableOpacity style={styles.drawerItem} onPress={handleRedesSociales}>
                <MaterialIcons name="share" size={24} color="#006c00" />
                <Text style={styles.drawerItemText}>Redes Sociales</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
              
              <View style={styles.separator} />
              
              <TouchableOpacity style={styles.drawerItem} onPress={handleCerrarSesion}>
                <MaterialIcons name="logout" size={24} color="#006c00" />
                <Text style={styles.drawerItemText}>Cerrar Sesión</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
              
              <View style={styles.separator} />
              
              <TouchableOpacity style={styles.drawerItem} onPress={handleSalir}>
                <MaterialIcons name="exit-to-app" size={24} color="#006c00" />
                <Text style={styles.drawerItemText}>Salir</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    left: 16,
    top: 25,
    padding: 8,
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  drawerHeader: {
    backgroundColor: '#006c00',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 4,
  },
  drawerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // Para compensar el botón de cerrar
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  drawerItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#e1e5e9',
    marginHorizontal: 20,
  },
});
