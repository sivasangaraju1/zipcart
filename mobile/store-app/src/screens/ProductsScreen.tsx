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

export default function ProductsScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [storeId])
  );

  const fetchProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: storeOperator } = await supabase
      .from('store_operators')
      .select('store_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (storeOperator) {
      setStoreId(storeOperator.store_id);

      const { data: inventoryData } = await supabase
        .from('inventory')
        .select(`
          product_id,
          quantity,
          products (
            id,
            name,
            description,
            base_price,
            is_active,
            category_id,
            slug
          )
        `)
        .eq('store_id', storeOperator.store_id)
        .order('products(name)');

      if (inventoryData) {
        const productsWithInventory = inventoryData.map((inv: any) => ({
          id: inv.products.id,
          name: inv.products.name,
          description: inv.products.description,
          price: inv.products.base_price,
          stock: inv.quantity,
          status: inv.products.is_active ? 'active' : 'inactive',
          category_id: inv.products.category_id,
          slug: inv.products.slug,
        }));
        setProducts(productsWithInventory);
      }
    }

    setLoading(false);
  };

  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    const newIsActive = currentStatus !== 'active';

    const { error } = await supabase
      .from('products')
      .update({ is_active: newIsActive })
      .eq('id', productId);

    if (error) {
      Alert.alert('Error', 'Failed to update product status');
    } else {
      fetchProducts();
    }
  };

  const deleteProduct = async (productId: string) => {
    Alert.alert('Delete Product', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

          if (error) {
            Alert.alert('Error', 'Failed to delete product');
          } else {
            fetchProducts();
          }
        },
      },
    ]);
  };

  const renderProduct = ({ item }: any) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
        <Text style={[
          styles.productStatus,
          item.status === 'active' ? styles.statusActive : styles.statusInactive
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditProduct', { product: item })}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.toggleButton]}
          onPress={() => toggleProductStatus(item.id, item.status)}
        >
          <Text style={styles.actionButtonText}>
            {item.status === 'active' ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteProduct(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddProduct', { storeId })}
          >
            <Text style={styles.addButtonText}>+ Add Product</Text>
          </TouchableOpacity>
        }
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
  list: {
    padding: 15,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  productInfo: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 5,
  },
  productStock: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  productStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusActive: {
    color: '#10B981',
  },
  statusInactive: {
    color: '#EF4444',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  toggleButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
