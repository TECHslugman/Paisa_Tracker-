// frontend/services/transactionService.ts
import { apiClient } from './apis';
import { useAuthStore } from '../store/authStore';

const getHeaders = (json = false) => {
  const token = useAuthStore.getState().token;
  return {
    'Authorization': `Bearer ${token}`,
    ...(json ? { 'Content-Type': 'application/json' } : {}),
  };
};

export const transactionService = {
  getHomeSummary: async () =>
    apiClient('/transactions/home-summary', { method: 'GET', headers: getHeaders() }),

  getAll: async () =>
    apiClient('/transactions', { headers: getHeaders() }),

  add: async (data: any) =>
    apiClient('/transactions', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }),

  update: async (id: string, data: Partial<{
    amount: number;
    type: 'debit' | 'credit';
    raw_sms: string;
    reference_id: string;
    timestamp: string;
    account_last4: string;
    source: string;
  }>) =>
    apiClient(`/transactions/${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }),

  delete: async (id: string) =>
    apiClient(`/transactions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }),
};