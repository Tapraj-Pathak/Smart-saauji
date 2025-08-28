const API_BASE: string = (import.meta as any)?.env?.VITE_API_URL || "http://localhost:4000/api";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean; // include Authorization header from localStorage token
}

async function apiRequest<T>(path: string, method: HttpMethod, options: RequestOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (options.auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {})
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore json parse errors
    }
    throw new Error(message);
  }
  // Attempt json; if empty, return as any
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export const api = {
  get: <T>(path: string, auth = false) => apiRequest<T>(path, 'GET', { auth }),
  post: <T>(path: string, body?: unknown, auth = false) => apiRequest<T>(path, 'POST', { body, auth }),
  put: <T>(path: string, body?: unknown, auth = false) => apiRequest<T>(path, 'PUT', { body, auth }),
  del: <T>(path: string, auth = false) => apiRequest<T>(path, 'DELETE', { auth }),
  baseUrl: API_BASE,
};

export default api;


