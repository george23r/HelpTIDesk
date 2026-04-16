import axios from 'axios';
import { storage } from './storage';

// Para emulador Android: http://10.0.2.2:3000
// Para dispositivo físico con USB: http://localhost:3000 (requiere adb reverse)
// Para WiFi: http://<tu-ip-local>:3000
const API_BASE_URL = 'http://192.168.20.4:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar JWT a las requests
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido, limpiar storage
      await storage.clear();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const ticketsAPI = {
  getAll: () => api.get('/tickets'),

  getById: (id: string) => api.get(`/tickets/${id}`),

  create: (data: { title: string; description: string; priority: string }) =>
    api.post('/tickets', data),

  update: (id: string, data: any) => api.put(`/tickets/${id}`, data),

  delete: (id: string) => api.delete(`/tickets/${id}`),
};

export default api;
