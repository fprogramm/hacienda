import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const ConnectionStatus: React.FC = () => {
  const { isApiConnected } = useAuth();

  return (
    <View style={[styles.container, isApiConnected ? styles.connected : styles.disconnected]}>
      <View style={[styles.indicator, isApiConnected ? styles.indicatorConnected : styles.indicatorDisconnected]} />
      <Text style={styles.text}>
        {isApiConnected ? '🟢 API Conectada' : '🔴 Modo Offline'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  connected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  disconnected: {
    backgroundColor: '#ffeaea',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  indicatorConnected: {
    backgroundColor: '#4caf50',
  },
  indicatorDisconnected: {
    backgroundColor: '#f44336',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});
