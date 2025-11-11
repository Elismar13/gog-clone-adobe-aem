import { Game } from '../domain/game';
import { AEM_HOST } from '../constants/constants';

export function mapGameFromAem(aem: any): Game {
  const imageList = Array.isArray(aem?.imageList) ? aem.imageList : [];
  return {
    _id: aem?._id || aem?.id || aem?.title || '',
    id: aem?.id ?? aem?._id ?? undefined,
    title: aem?.title ?? '',
    description: aem?.description ?? '',
    price: Number(aem?.price ?? 0),
    score: Number(aem?.score ?? 0),
    discountValue: Number(aem?.discountValue ?? 0),
    releaseDate: aem?.releaseDate ?? null,
    genre: aem?.genre ?? null,
    developer: aem?.developer ?? { name: '' },
    imageList: imageList,
  };
}

export function getPrimaryImageUrl(game: Game): string | undefined {
  const first = game.imageList && game.imageList[0]?._path;
  return first ? `${AEM_HOST}${first}` : undefined;
}

export function mapGames(list: any[]): Game[] {
  return (Array.isArray(list) ? list : []).map(mapGameFromAem);
}
