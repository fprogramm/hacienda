import { ErrorHandler } from '@/utils/errorHandler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = screenWidth * 0.8; // 80% del ancho de la pantalla

interface HeaderMenuProps {
  // Puedes agregar props aquí si necesitas pasar datos desde el componente padre
}

export default function HeaderMenu({ }: HeaderMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));

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
      ErrorHandler.showWarning('No hay sesión activa para cerrar.');
    }, 300);
  };

  const handleSalir = () => {
    closeMenu();
    setTimeout(() => {
      ErrorHandler.showWarning('¿Está seguro que desea salir de la aplicación?');
    }, 300);
  };

  return (
    <>
      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <MaterialIcons name="menu" size={24} color="white" />
      </TouchableOpacity>

      {/* Drawer Overlay and Menu */}
      {isMenuOpen && (
        <>
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
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    left: 16,
    top: 48,
    padding: 8,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: 'white',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    flex: 1,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
});