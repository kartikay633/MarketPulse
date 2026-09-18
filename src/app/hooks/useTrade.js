// ROADMAP: Section 5 & 11 — Trade & Portfolio React Query Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'sonner';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await api.get('/portfolio');
      return res.data;
    },
    staleTime: 10000,
    refetchInterval: 15000,
  });
}

export function useOrders(limit = 50) {
  return useQuery({
    queryKey: ['trade', 'orders', limit],
    queryFn: async () => {
      const res = await api.get(`/trade/orders?limit=${limit}`);
      return res.data?.orders || [];
    },
    staleTime: 10000,
  });
}

export function useExecuteTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ symbol, type, quantity }) => {
      const res = await api.post('/trade/order', { symbol, type, quantity });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['trade', 'orders'] });
      const ord = data.order;
      toast.success(
        `Executed ${ord.type} order for ${ord.quantity} shares of ${ord.symbol} at ₹${ord.price.toFixed(2)}`
      );
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to execute simulated trade');
    },
  });
}
