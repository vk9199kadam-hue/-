import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to requests
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==== Products API ====

export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProduct = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData: any) => {
  const { data } = await api.post('/products', productData);
  return data;
};

export const updateProduct = async (id: string, productData: any) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// ==== Upload API ====

export const uploadImage = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append('image', file);
  if (folder) formData.append('folder', folder);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const uploadMultipleImages = async (files: File[], folder?: string) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  if (folder) formData.append('folder', folder);
  const { data } = await api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteImage = async (publicId: string) => {
  const { data } = await api.delete(`/upload/${publicId}`);
  return data;
};

// ==== Auth API ====

export const adminLogin = async (idToken: string, adminSecret: string) => {
  const { data } = await api.post('/auth/admin-login', { idToken, adminSecret });
  return data;
};

export const verifyTokenAPI = async (idToken: string) => {
  const { data } = await api.post('/auth/verify', { idToken });
  return data;
};

// ==== Health Check ====

export const checkHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export default api;
