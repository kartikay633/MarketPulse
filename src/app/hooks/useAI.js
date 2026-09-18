// ROADMAP: Section 5 & 10 — AI React Query Hooks
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';

export function useAIMarketSummary() {
  return useQuery({
    queryKey: ['ai', 'market-summary'],
    queryFn: async () => {
      const res = await api.get('/ai/market-summary');
      return res.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes cache
    refetchInterval: 15 * 60 * 1000,
  });
}

export function useAIStockInsight(symbol) {
  return useQuery({
    queryKey: ['ai', 'stock-insight', symbol],
    queryFn: async () => {
      if (!symbol) return null;
      const res = await api.get(`/ai/stock-insight/${encodeURIComponent(symbol)}`);
      return res.data;
    },
    enabled: Boolean(symbol),
    staleTime: 15 * 60 * 1000,
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: async ({ message, conversationId, symbol }) => {
      const res = await api.post('/ai/chat', { message, conversationId, symbol });
      return res.data;
    },
  });
}
