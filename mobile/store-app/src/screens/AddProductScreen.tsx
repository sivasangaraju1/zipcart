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

export default function AddProductScreen({ route, navigation }: any) {
  const { storeId } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('is_active', true)
      .order('name');

    if (!error && data) {
      setCategories(data);
      if (data.length > 0) {
        setCategoryId(data[0].id);
      }
    }
    setLoadingCategories(false);
  };

  const handleAddProduct = async () => {
    if (!name || !price || !stock || !categoryId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          category_id: categoryId,
          name,
          slug,
          description: description || null,
          base_price: parseFloat(price),
          is_active: true,
        })
        .select()
        .single();

      if (productError) throw productError;

      const { error: inventoryError } = await supabase
        .from('inventory')
        .insert({
          product_id: product.id,
          store_id: storeId,
          quantity: parseInt(stock),
          reserved_quantity: 0,
        });

      if (inventoryError) throw inventoryError;

      Alert.alert('Success', 'Product added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Error adding product:', error);
      Alert.alert('Error', error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading categories...</Text>
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
          onPress={handleAddProduct}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Adding...' : 'Add Product'}
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
