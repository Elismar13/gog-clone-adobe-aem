import { useCallback, useEffect, useMemo, useState } from 'react';
import { TagItem, getGenres } from '../services/tagsService';

export function useGenres() {
  const [data, setData] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const { data, error } = await getGenres();
    if (error) setError(error);
    setData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => ({ data, loading, error, refetch: fetchData }), [data, loading, error, fetchData]);
}
