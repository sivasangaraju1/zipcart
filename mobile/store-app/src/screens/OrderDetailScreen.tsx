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

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready'];

export default function OrderDetailScreen({ route, navigation }: any) {
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
      .select('*, users!customer_id(full_name, phone)')
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

  const updateOrderStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      Alert.alert('Error', 'Failed to update order status');
    } else {
      setOrder({ ...order, status: newStatus });
    }
  };

  const getNextStatus = () => {
    const currentIndex = STATUS_FLOW.indexOf(order.status);
    if (currentIndex < STATUS_FLOW.length - 1) {
      return STATUS_FLOW[currentIndex + 1];
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const nextStatus = getNextStatus();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>

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

        {nextStatus && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => updateOrderStatus(nextStatus)}
          >
            <Text style={styles.updateButtonText}>
              Mark as {nextStatus.toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}

        {order.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              Alert.alert('Cancel Order', 'Are you sure?', [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes',
                  style: 'destructive',
                  onPress: () => updateOrderStatus('cancelled'),
                },
              ]);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
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
  updateButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
