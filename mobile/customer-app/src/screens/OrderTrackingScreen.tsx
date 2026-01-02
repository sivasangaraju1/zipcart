import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function OrderTrackingScreen({ route }: any) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();

    const subscription = supabase
      .channel(`order:${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      }, (payload) => {
        setOrder(payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId]);

  const fetchOrderDetails = async () => {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*, stores(name), delivery_partners(users(full_name))')
      .eq('id', orderId)
      .single();

    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*, products(name, price)')
      .eq('order_id', orderId);

    if (orderData) setOrder(orderData);
    if (itemsData) setItems(itemsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Order Status</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>

        <Text style={styles.sectionTitle}>Store</Text>
        <Text style={styles.infoText}>{order.stores?.name}</Text>

        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.infoText}>{order.delivery_address}</Text>

        {order.delivery_partner_id && (
          <>
            <Text style={styles.sectionTitle}>Delivery Partner</Text>
            <Text style={styles.infoText}>
              {order.delivery_partners?.users?.full_name || 'Assigned'}
            </Text>
          </>
        )}

        <Text style={styles.sectionTitle}>Order Items</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.products?.name} x {item.quantity}
            </Text>
            <Text style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${order.total_amount.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusCard: {
    backgroundColor: '#4F46E5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#6B7280',
  },
  infoText: {
    fontSize: 16,
    color: '#111827',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    color: '#4F46E5',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    marginTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
});
