import api from '../axios';

export type TagItem = {
  path: string;
  name: string;
  title: string;
};

export type ServiceResult<T> = {
  data: T;
  error?: string;
};

export async function getGenres(): Promise<ServiceResult<TagItem[]>> {
  try {
    const endpoint = `/bin/querybuilder.json?type=cq:tag&path=/content/cq:tags/genre`;
    const response = await api.get(endpoint);
    const hits: any[] = response?.data?.hits || [];
    const items: TagItem[] = hits.map((h: any) => ({
      path: h?.path || '',
      name: h?.name || '',
      title: h?.title || h?.name || ''
    }));
    return { data: items };
  } catch (e: any) {
    return { data: [], error: e?.message || 'Failed to fetch genres' };
  }
}
