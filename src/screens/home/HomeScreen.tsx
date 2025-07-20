import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ConnectionStatus } from '@/src/components/common/ConnectionStatus';
import Header from '@/src/components/common/Header';
import MenuCard from '@/src/components/common/MenuCard';
import { createMenuItems } from '@/src/constants/menuItems';
import { useAuth } from '@/src/context/AuthContext';

interface HomeScreenProps {
  navigation?: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const menuItems = createMenuItems(navigation);

  return (
    <View style={styles.container}>
      <Header />
      
      {/* Connection Status */}
      <ConnectionStatus />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.nameText}>
            {user?.fullName || 'Usuario'}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
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
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  welcomeText: {
    textAlign: 'center',
    color: '#006c00',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  nameText: {
    textAlign: 'center',
    color: '#1e1e1e',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuSection: {
    paddingVertical: 16,
  },
  bottomSpace: {
    backgroundColor: '#820024',
    height: 160,
    marginTop: 16,
  },
});
