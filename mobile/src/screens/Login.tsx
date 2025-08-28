import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';

interface Props { onAuthed: () => void }

export default function Login({ onAuthed }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      if (!email || !password) throw new Error('Email and password required');
      let endpoint = '/auth/login';
      let payload: any = { email, password };
      if (!isLogin) {
        if (!panNumber) throw new Error('PAN required');
        endpoint = '/auth/register';
        payload = { name: name || email, email, password, role: 'owner', panNumber };
      }
      const res = await api.post<any>(endpoint, payload);
      if (res?.token) await AsyncStorage.setItem('token', res.token);
      onAuthed();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
      {!isLogin && (
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      )}
      <TextInput style={styles.input} placeholder="Email" autoCapitalize='none' keyboardType='email-address' value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {!isLogin && (
        <TextInput style={styles.input} placeholder="PAN Number" autoCapitalize='characters' value={panNumber} onChangeText={setPanNumber} />
      )}
      <TouchableOpacity style={styles.primary} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(v => !v)}>
        <Text style={styles.link}>{isLogin ? 'No account? Sign Up' : 'Have an account? Sign In'}</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>API: {api.baseUrl}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 },
  primary: { backgroundColor: '#111827', padding: 12, borderRadius: 8, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 8 },
  hint: { textAlign: 'center', color: '#6b7280', marginTop: 12 }
});
