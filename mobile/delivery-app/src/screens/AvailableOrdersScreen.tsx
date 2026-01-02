import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

export default function AvailableOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchAvailableOrders();
    }, [])
  );

  const fetchAvailableOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: partner } = await supabase
      .from('delivery_partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (partner) {
      setPartnerId(partner.id);
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, stores(name), users!customer_id(full_name)')
      .eq('status', 'ready')
      .is('delivery_partner_id', null)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const acceptOrder = async (orderId: string) => {
    if (!partnerId) {
      Alert.alert('Error', 'Partner profile not found');
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({
        delivery_partner_id: partnerId,
        status: 'picked_up',
      })
      .eq('id', orderId);

    if (error) {
      Alert.alert('Error', 'Failed to accept order');
    } else {
      Alert.alert('Success', 'Order accepted!');
      fetchAvailableOrders();
    }
  };

  const renderOrder = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderStore}>{item.stores?.name}</Text>
        <Text style={styles.orderCustomer}>
          Customer: {item.users?.full_name}
        </Text>
        <Text style={styles.orderAddress}>{item.delivery_address}</Text>
        <Text style={styles.orderAmount}>${item.total_amount.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => acceptOrder(item.id)}
      >
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No available orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
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
  orderCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  orderInfo: {
    marginBottom: 15,
  },
  orderStore: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  orderCustomer: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  orderAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  acceptButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
