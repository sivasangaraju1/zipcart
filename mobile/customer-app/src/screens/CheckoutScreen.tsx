import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckoutScreen({ route, navigation }: any) {
  const { cart, total } = route.params;
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter delivery address');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      Alert.alert('Error', 'Please login to place order');
      return;
    }

    const storeId = cart[0]?.store_id;

    if (!storeId) {
      setLoading(false);
      Alert.alert('Error', 'Invalid cart data');
      return;
    }

    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        street_address: address,
        city: 'City',
        state: 'State',
        zip_code: '00000',
        label: 'delivery',
      })
      .select()
      .single();

    if (addressError || !addressData) {
      setLoading(false);
      Alert.alert('Error', 'Failed to save address: ' + (addressError?.message || ''));
      return;
    }

    const subtotal = total;
    const taxAmount = subtotal * 0.08;
    const deliveryFee = 2.99;
    const totalAmount = subtotal + taxAmount + deliveryFee;

    const orderNumber = 'ZC' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        store_id: storeId,
        address_id: addressData.id,
        subtotal: subtotal,
        tax_amount: taxAmount,
        delivery_fee: deliveryFee,
        tip_amount: 0,
        total_amount: totalAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      setLoading(false);
      Alert.alert('Error', 'Failed to place order: ' + (orderError?.message || ''));
      return;
    }

    const orderItems = cart.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      tax_amount: item.price * item.quantity * 0.08,
      total_price: item.price * item.quantity * 1.08,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    setLoading(false);

    if (itemsError) {
      Alert.alert('Error', 'Failed to save order items: ' + (itemsError?.message || ''));
      return;
    }

    await AsyncStorage.removeItem('cart');

    Alert.alert('Success', 'Order placed successfully!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('MainTabs', { screen: 'Orders' }),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cart.map((item: any) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemName}>
              {item.name} x {item.quantity}
            </Text>
            <Text style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TextInput
          style={styles.addressInput}
          placeholder="Enter your delivery address"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={placeOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
  },
  orderItem: {
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
    marginBottom: 20,
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
  addressInput: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  placeOrderButton: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
