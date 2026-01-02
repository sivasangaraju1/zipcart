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

export default function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [storeId])
  );

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Get the store through store_operators table
    const { data: storeOperator } = await supabase
      .from('store_operators')
      .select('store_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (storeOperator) {
      setStoreId(storeOperator.store_id);

      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles!orders_user_id_fkey(id)
        `)
        .eq('store_id', storeOperator.store_id)
        .order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'preparing': return '#8B5CF6';
      case 'ready': return '#10B981';
      case 'picked_up': return '#06B6D4';
      case 'delivered': return '#22C55E';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderOrder = ({ item }: any) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.orderAmount}>${item.total_amount.toFixed(2)}</Text>
      <Text style={styles.orderDate}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </TouchableOpacity>
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
        <Text style={styles.emptyText}>No orders yet</Text>
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
  },
});
