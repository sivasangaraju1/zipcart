import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

export default function MyDeliveriesScreen({ navigation }: any) {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchMyDeliveries();
    }, [])
  );

  const fetchMyDeliveries = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: partner } = await supabase
      .from('delivery_partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!partner) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, stores(name), users!customer_id(full_name)')
      .eq('delivery_partner_id', partner.id)
      .order('created_at', { ascending: false });

    if (data) {
      setDeliveries(data);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up': return '#06B6D4';
      case 'delivered': return '#22C55E';
      default: return '#6B7280';
    }
  };

  const renderDelivery = ({ item }: any) => (
    <TouchableOpacity
      style={styles.deliveryCard}
      onPress={() => navigation.navigate('DeliveryDetail', { orderId: item.id })}
    >
      <View style={styles.deliveryHeader}>
        <Text style={styles.deliveryStore}>{item.stores?.name}</Text>
        <Text style={[styles.deliveryStatus, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.deliveryCustomer}>
        Customer: {item.users?.full_name}
      </Text>
      <Text style={styles.deliveryAddress}>{item.delivery_address}</Text>
      <Text style={styles.deliveryAmount}>${item.total_amount.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (deliveries.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No deliveries yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveries}
        renderItem={renderDelivery}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
  },
  list: {
    padding: 15,
  },
  deliveryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deliveryStore: {
    fontSize: 18,
    fontWeight: '600',
  },
  deliveryStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryCustomer: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  deliveryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
});
