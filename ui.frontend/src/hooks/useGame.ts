import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Game } from '../domain/game';
import { getByTitle } from '../services/gamesService';

export function useGame(params: { id?: string; title?: string }) {
  const [data, setData] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Hoje uso o título, mas vou migrar para o id.
  const key = params.title || params.id || '';

  const fetchData = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    setError(undefined);
    const { data, error } = await getByTitle(params.title ?? '');
    if (error) setError(error);
    setData(data);
    setLoading(false);
  }, [key, params.title]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const result = useMemo(() => ({ data, loading, error, refetch: fetchData }), [data, loading, error, fetchData]);
  return result;
}
