import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Game } from '../domain/game';
import { getByGenre } from '../services/gamesService';

export function useGamesByGenre(genre: string) {
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const { data, error } = await getByGenre(genre);
    if (error) setError(error);
    setData(data);
    setLoading(false);
  }, [genre]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const result = useMemo(() => ({ data, loading, error, refetch: fetchData }), [data, loading, error, fetchData]);
  return result;
}
