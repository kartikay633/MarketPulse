// ROADMAP: Section 5 & 9 — News React Query Hooks
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useMarketNews(category = 'all', limit = 15) {
  return useQuery({
    queryKey: ['news', 'market', category, limit],
    queryFn: async () => {
      const res = await api.get(`/news?category=${category}&limit=${limit}`);
      return res.data?.articles || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useStockNews(symbol, limit = 6) {
  return useQuery({
    queryKey: ['news', 'stock', symbol, limit],
    queryFn: async () => {
      if (!symbol) return [];
      const res = await api.get(`/stocks/${encodeURIComponent(symbol)}/news?limit=${limit}`);
      return res.data?.articles || [];
    },
    enabled: Boolean(symbol),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
}
