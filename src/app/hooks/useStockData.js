// ROADMAP: Section 5 & Phase 3 — Stock Data React Query Hooks
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useStockQuote(symbol) {
  return useQuery({
    queryKey: ['stock', 'quote', symbol],
    queryFn: async () => {
      if (!symbol) return null;
      const res = await api.get(`/stocks/${encodeURIComponent(symbol)}`);
      return res.data;
    },
    enabled: Boolean(symbol),
    staleTime: 15000,
    refetchInterval: 15000,
  });
}

export function useStockHistory(symbol, interval = '1D') {
  return useQuery({
    queryKey: ['stock', 'history', symbol, interval],
    queryFn: async () => {
      if (!symbol) return [];
      const res = await api.get(`/stocks/${encodeURIComponent(symbol)}/history?interval=${interval}`);
      return res.data?.candles || [];
    },
    enabled: Boolean(symbol),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useStockSearch(query) {
  return useQuery({
    queryKey: ['stock', 'search', query],
    queryFn: async () => {
      const res = await api.get(`/search?q=${encodeURIComponent(query || '')}`);
      return res.data?.results || [];
    },
    staleTime: 60000,
  });
}
