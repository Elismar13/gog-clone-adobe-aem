import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Game } from '../domain/game';
import { getDiscounted } from '../services/gamesService';

export function useDiscountedGames() {
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const { data, error } = await getDiscounted();
    if (error) setError(error);
    setData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const result = useMemo(() => ({ data, loading, error, refetch: fetchData }), [data, loading, error, fetchData]);
  return result;
}
