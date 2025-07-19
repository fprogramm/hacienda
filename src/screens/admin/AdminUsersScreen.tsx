import { databaseService } from '@/src/services/database';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DatabaseUser {
  id: number;
  cedula: string;
  name: string;
  fullName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserCardProps {
  user: DatabaseUser;
  onRefresh: () => void;
}

function UserCard({ user, onRefresh }: UserCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('es-CO');
  };

  return (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userCedula}>Cédula: {user.cedula}</Text>
        </View>
        <View style={[styles.statusBadge, user.isActive ? styles.activeBadge : styles.inactiveBadge]}>
          <Text style={styles.statusText}>
            {user.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      
      <View style={styles.userDetails}>
        {user.email && (
          <Text style={styles.userDetail}>📧 {user.email}</Text>
        )}
        {user.phone && (
          <Text style={styles.userDetail}>📱 {user.phone}</Text>
        )}
        <Text style={styles.userDetail}>📅 Creado: {formatDate(user.createdAt)}</Text>
        <Text style={styles.userDetail}>🔐 Último login: {formatDate(user.lastLogin)}</Text>
      </View>
    </View>
  );
}

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await databaseService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Administrar Usuarios</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={loadUsers}
        >
          <MaterialIcons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>Usuarios del Sistema</Text>
          <Text style={styles.subtitle}>Total: {users.length} usuarios</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando usuarios...</Text>
          </View>
        ) : (
          <View style={styles.usersContainer}>
            {users.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                onRefresh={loadUsers}
              />
            ))}
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
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#006c00',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006c00',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  usersContainer: {
    gap: 16,
  },
  userCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userCedula: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#e8f5e8',
  },
  inactiveBadge: {
    backgroundColor: '#fee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userDetails: {
    gap: 6,
  },
  userDetail: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  bottomSpace: {
    height: 20,
  },
});
