import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Game } from '../domain/game';
import { GamesFilter, searchWithFilter } from '../services/gamesService';

export function useGamesWithFilter(initial: GamesFilter) {
  const [filters, setFilters] = useState<GamesFilter>(initial);
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const { data, error } = await searchWithFilter(filters);
    if (error) setError(error);
    setData(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const result = useMemo(
    () => ({ data, loading, error, setFilters, refetch: fetchData, filters }),
    [data, loading, error, fetchData, filters]
  );
  return result;
}
