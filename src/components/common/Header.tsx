import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import HeaderMenu from './HeaderMenu';



export default function Header() {
  return (
    <View style={styles.header}>
      <StatusBar style="light" />
      
      {/* Menu hamburguesa */}
      <HeaderMenu />
      
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/escudo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.headerTitle}>HACIENDA MUNICIPAL</Text>
      <Text style={styles.headerSubtitle}>Liborina - Antioquia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#006c00',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative', // Para posicionar el menú
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 13,
    overflow: 'hidden',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
});
