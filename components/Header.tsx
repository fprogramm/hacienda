import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import HeaderMenu from './HeaderMenu';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export default function Header({ title = "Hacienda Liborina", showLogo = true }: HeaderProps) {
  return (
    <>
      {/* Render drawer at screen level */}
      <HeaderMenu />
      
      {/* Header content */}
      <View style={styles.header}>
        {/* Menu button placeholder - actual button is in HeaderMenu */}
        <View style={styles.menuButtonPlaceholder} />
        
        <View style={styles.logoContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {showLogo && (
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006c00',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    minHeight: 100,
  },
  menuButtonPlaceholder: {
    width: 40, 
    height: 40,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 70, 
    height: 70, 
    marginLeft: 8, 
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
