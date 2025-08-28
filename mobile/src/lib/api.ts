// Create a simple API client for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function request<T>(path: string, method: HttpMethod, body?: unknown, auth?: boolean): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = await AsyncStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try { const j = await res.json(); if (j?.message) msg = j.message; } catch {}
    throw new Error(msg);
  }
  try { return await res.json() as T; } catch { return undefined as unknown as T; }
}

export const api = {
  baseUrl: API_BASE,
  get: <T>(p: string, a = false) => request<T>(p, 'GET', undefined, a),
  post: <T>(p: string, b?: unknown, a = false) => request<T>(p, 'POST', b, a),
  put: <T>(p: string, b?: unknown, a = false) => request<T>(p, 'PUT', b, a),
  del: <T>(p: string, a = false) => request<T>(p, 'DELETE', undefined, a),
};
export default api;
