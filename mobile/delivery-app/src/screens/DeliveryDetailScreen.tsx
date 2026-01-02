import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function DeliveryDetailScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*, stores(name, address), users!customer_id(full_name, phone)')
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

  const markAsDelivered = async () => {
    Alert.alert(
      'Mark as Delivered',
      'Confirm order has been delivered?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const { error } = await supabase
              .from('orders')
              .update({ status: 'delivered' })
              .eq('id', orderId);

            if (error) {
              Alert.alert('Error', 'Failed to update status');
            } else {
              Alert.alert('Success', 'Order marked as delivered', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            }
          },
        },
      ]
    );
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
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>

        <Text style={styles.sectionTitle}>Store</Text>
        <Text style={styles.infoText}>{order.stores?.name}</Text>
        <Text style={styles.infoSubtext}>{order.stores?.address}</Text>

        <Text style={styles.sectionTitle}>Customer</Text>
        <Text style={styles.infoText}>{order.users?.full_name}</Text>
        <Text style={styles.infoSubtext}>{order.users?.phone}</Text>

        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.infoText}>{order.delivery_address}</Text>

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

        {order.status === 'picked_up' && (
          <TouchableOpacity
            style={styles.deliveredButton}
            onPress={markAsDelivered}
          >
            <Text style={styles.deliveredButtonText}>Mark as Delivered</Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 5,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#6B7280',
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
    marginBottom: 20,
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
  deliveredButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deliveredButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
