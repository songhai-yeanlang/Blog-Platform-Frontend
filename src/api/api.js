import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Profile API endpoints
export const getMyProfile = () => api.get('/my-profile')

export const updateMyProfile = (payload) => api.put('/update-profile', payload)

export const uploadAvatar = (file) => {
  const form = new FormData()
  form.append('avatar', file)
  return api.post('/profile/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const changePassword = (payload) => api.post('/auth/change-password', payload)

export default api;
