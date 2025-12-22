import api from '../axios';

export type DeveloperRef = {
  _path: string;
  name: string;
};

export type ServiceResult<T> = {
  data: T;
  error?: string;
};

export async function getDevelopers(): Promise<ServiceResult<DeveloperRef[]>> {
  try {
    const endpoint = `/graphql/execute.json/gogstore/getDeveloperList`;
    const response = await api.get(endpoint);
    const items: DeveloperRef[] = response?.data?.data?.desenvolvedorList?.items || [];
    return { data: items };
  } catch (e: any) {
    return { data: [], error: e?.message || 'Failed to fetch developers' };
  }
}
