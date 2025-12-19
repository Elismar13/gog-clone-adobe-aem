import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeveloperRef, getDevelopers } from '../services/developersService';

export function useDevelopers() {
  const [data, setData] = useState<DeveloperRef[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const { data, error } = await getDevelopers();
    if (error) setError(error);
    setData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => ({ data, loading, error, refetch: fetchData }), [data, loading, error, fetchData]);
}
