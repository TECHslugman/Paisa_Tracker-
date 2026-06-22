// frontend/services/authService.ts
import { apiClient } from '../services/apis';

export const authService = {
register: async (userData: { name: string; email: string; password: string; number: string }) => {
    return await apiClient('/auth/register', { 
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (credentials: { email: string; password: string }) => {
    return await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
};