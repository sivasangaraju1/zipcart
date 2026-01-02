import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: partnerData } = await supabase
        .from('delivery_partners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (partnerData) {
        setPartner(partnerData);
      }
    }
  };

  const toggleAvailability = async () => {
    if (!partner) return;

    const newStatus = partner.status === 'available' ? 'busy' : 'available';

    const { error } = await supabase
      .from('delivery_partners')
      .update({ status: newStatus })
      .eq('id', partner.id);

    if (error) {
      Alert.alert('Error', 'Failed to update status');
    } else {
      setPartner({ ...partner, status: newStatus });
      Alert.alert('Success', `Status changed to ${newStatus}`);
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <Text style={styles.name}>{user?.user_metadata?.full_name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.phone}>{user?.user_metadata?.phone}</Text>
          {partner && (
            <>
              <Text style={styles.vehicle}>
                Vehicle: {user?.user_metadata?.vehicle_info}
              </Text>
              <View style={[
                styles.statusBadge,
                partner.status === 'available' ? styles.statusAvailable : styles.statusBusy
              ]}>
                <Text style={styles.statusBadgeText}>
                  {partner.status.toUpperCase()}
                </Text>
              </View>
            </>
          )}
        </View>

        {partner && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleAvailability}
          >
            <Text style={styles.toggleButtonText}>
              {partner.status === 'available' ? 'Go Offline' : 'Go Online'}
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
    marginBottom: 5,
  },
  vehicle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: '#10B981',
  },
  statusBusy: {
    backgroundColor: '#F59E0B',
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '600',
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
