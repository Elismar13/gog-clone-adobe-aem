import api from '../axios';
import mockedGames from '../api/mocked';
import { Game } from '../domain/game';
import { mapGameFromAem, mapGames } from '../mappers/gameMapper';

export type ServiceResult<T> = {
  data: T;
  error?: string;
};

function safeMapList(items: any[]): Game[] {
  try {
    return mapGames(items || []);
  } catch (e) {
    return mapGames(mockedGames as any);
  }
}

export async function getByTitle(title: string): Promise<ServiceResult<Game | null>> {
  try {
    const endpoint = `/graphql/execute.json/gogstore/getGamebyTitle`;
    const response = await api.post(endpoint, { variables: { title } });
    const items = response?.data?.data?.jogoList?.items || [];
    const mapped = safeMapList(items);
    return { data: mapped[0] ?? null };
  } catch (e: any) {
    const mapped = safeMapList(mockedGames as any);
    return { data: mapped[0] ?? null, error: e?.message || 'Failed to fetch by title' };
  }
}

export async function getByGenre(genre: string): Promise<ServiceResult<Game[]>> {
  try {
    const gameGenre = genre?.split('/')?.at(-1) || genre;
    const endpoint = `/graphql/execute.json/gogstore/getGamesByGenre;gameGenre=${gameGenre}`;
    const response = await api.get(endpoint);
    const items = response?.data?.data?.jogoList?.items || [];
    const mapped = safeMapList(items);
    return { data: mapped };
  } catch (e: any) {
    return { data: safeMapList(mockedGames as any), error: e?.message || 'Failed to fetch by genre' };
  }
}

export async function getDiscounted(): Promise<ServiceResult<Game[]>> {
  try {
    const endpoint = `/graphql/execute.json/gogstore/getGamesThatHasDiscount`;
    const response = await api.get(endpoint);
    const items = response?.data?.data?.jogoList?.items || [];
    const mapped = safeMapList(items);
    return { data: mapped };
  } catch (e: any) {
    const fallback = (mockedGames as any).filter((g: any) => Number(g?.discountValue) > 0);
    return { data: safeMapList(fallback), error: e?.message || 'Failed to fetch discounted' };
  }
}

export type GamesFilter = {
  gameTitle?: string;
  isDiscounted?: boolean | number;
  genres?: string | string[];
  developer?: string;
  minScore?: number;
};

export async function searchWithFilter(filters: GamesFilter): Promise<ServiceResult<Game[]>> {
  try {
    const endpoint = `/graphql/execute.json/gogstore/getGamesWithFilter`;
    const response = await api.post(endpoint, { variables: filters });
    const items = response?.data?.data?.jogoList?.items || [];
    const mapped = safeMapList(items);
    return { data: mapped };
  } catch (e: any) {
    return { data: safeMapList(mockedGames as any), error: e?.message || 'Failed to search with filter' };
  }
}
