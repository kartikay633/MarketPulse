// ROADMAP: Section 5 & 11 — Watchlist React Query Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'sonner';

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const res = await api.get('/watchlist');
      return res.data?.items || [];
    },
    staleTime: 15000,
    refetchInterval: 15000,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (symbol) => {
      const res = await api.post('/watchlist/items', { symbol });
      return res.data;
    },
    onSuccess: (_, symbol) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success(`Added ${symbol} to Watchlist`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to add stock to watchlist');
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (symbol) => {
      const res = await api.delete(`/watchlist/items/${encodeURIComponent(symbol)}`);
      return res.data;
    },
    onSuccess: (_, symbol) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.info(`Removed ${symbol} from Watchlist`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to remove stock from watchlist');
    },
  });
}
