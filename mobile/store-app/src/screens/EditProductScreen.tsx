import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
}

export default function EditProductScreen({ route, navigation }: any) {
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [categoryId, setCategoryId] = useState(product.category_id || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
    }

    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('is_active', true)
      .order('name');

    if (!error && data) {
      setCategories(data);
    }
    setLoadingCategories(false);
  };

  const handleUpdateProduct = async () => {
    if (!name || !price || !stock || !categoryId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!storeId) {
      Alert.alert('Error', 'Store information not found');
      return;
    }

    setLoading(true);

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const { error: productError } = await supabase
        .from('products')
        .update({
          name,
          slug,
          description: description || null,
          base_price: parseFloat(price),
          category_id: categoryId,
        })
        .eq('id', product.id);

      if (productError) throw productError;

      const { error: inventoryError } = await supabase
        .from('inventory')
        .update({
          quantity: parseInt(stock),
        })
        .eq('product_id', product.id)
        .eq('store_id', storeId);

      if (inventoryError) throw inventoryError;

      Alert.alert('Success', 'Product updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Error updating product:', error);
      Alert.alert('Error', error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Product Name *"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Category *</Text>
          <Picker
            selectedValue={categoryId}
            onValueChange={(value) => setCategoryId(value)}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Price *"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Stock Quantity *"
          value={stock}
          onChangeText={setStock}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdateProduct}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Updating...' : 'Update Product'}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    padding: 20,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
