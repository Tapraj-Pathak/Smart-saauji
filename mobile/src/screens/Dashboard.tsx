import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';

interface Product { id: string; name: string; quantity: number; category?: string; expiryDate?: string; minStock?: number; createdAt: string; updatedAt: string; }

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.get<Product[]>('/products');
      setProducts(data);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const adjust = async (id: string, delta: number) => {
    try {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(0, (p.quantity || 0) + delta) } : p));
      await api.post(`/products/${id}/adjust`, { delta }, true);
    } catch (e: any) {
      Alert.alert('Update failed', e.message || '');
    }
  };

  const create = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return Alert.alert('Login required');
      const payload = { name, quantity: Number(quantity) || 0 };
      const created: any = await api.post('/products', payload, true);
      setProducts(prev => [{ id: created._id, name: created.name, quantity: created.quantity || 0, createdAt: created.createdAt, updatedAt: created.updatedAt }, ...prev]);
      setName(''); setQuantity('');
    } catch (e: any) {
      Alert.alert('Create failed', e.message || '');
    }
  };

  if (loading) return (<View style={styles.center}><ActivityIndicator /></View>);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Qty" keyboardType='numeric' value={quantity} onChangeText={setQuantity} />
        <TouchableOpacity style={styles.primary} onPress={create}><Text style={styles.primaryText}>Add</Text></TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.sub}>Qty: {item.quantity}</Text>
            </View>
            <TouchableOpacity style={styles.outline} onPress={() => adjust(item.id, -1)} disabled={item.quantity === 0}><Text>-</Text></TouchableOpacity>
            <TouchableOpacity style={styles.outline} onPress={() => adjust(item.id, 1)}><Text>+</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, flex: 1 },
  primary: { backgroundColor: '#111827', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 10 },
  title: { fontWeight: '700' },
  sub: { color: '#6b7280', marginTop: 2 },
});
