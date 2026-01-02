import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    setUser(user);

    if (user) {
      // Get the store through store_operators table
      const { data: storeOperator } = await supabase
        .from('store_operators')
        .select('store_id, stores(*)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (storeOperator?.stores) {
        setStore(storeOperator.stores);
      }
    }
    setLoading(false);
  };

  const toggleStoreStatus = async () => {
    if (!store) return;

    const newIsActive = !store.is_active;

    const { error } = await supabase
      .from('stores')
      .update({ is_active: newIsActive })
      .eq('id', store.id);

    if (error) {
      Alert.alert('Error', 'Failed to update store status');
    } else {
      setStore({ ...store, is_active: newIsActive });
      Alert.alert('Success', `Store is now ${newIsActive ? 'active' : 'inactive'}`);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <Text style={styles.name}>{user?.user_metadata?.name || user?.user_metadata?.full_name || 'Store Operator'}</Text>
          <Text style={styles.email}>{user?.email || 'No email'}</Text>
          {user?.user_metadata?.phone && (
            <Text style={styles.phone}>{user.user_metadata.phone}</Text>
          )}
        </View>

        {store && (
          <View style={styles.storeCard}>
            <Text style={styles.storeTitle}>Store Information</Text>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeAddress}>{store.address}</Text>
            <View style={[
              styles.statusBadge,
              store.is_active ? styles.statusActive : styles.statusInactive
            ]}>
              <Text style={styles.statusBadgeText}>
                {store.is_active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>
        )}

        {store && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleStoreStatus}
          >
            <Text style={styles.toggleButtonText}>
              {store.is_active ? 'Close Store' : 'Open Store'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: '#6B7280',
  },
  storeCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  storeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  storeAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#10B981',
  },
  statusInactive: {
    backgroundColor: '#EF4444',
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  toggleButton: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
