// frontend/services/transactionService.ts
import { apiClient } from './apis';
import { useAuthStore } from '../store/authStore';

export const transactionService = {
  getHomeSummary: async () => {
    const token = useAuthStore.getState().token;
    return await apiClient('/transactions/home-summary', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
};