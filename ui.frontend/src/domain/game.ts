export type ImageRef = {
  _path: string;
};

export type Developer = {
  name: string;
};

export type Game = {
  _id: string;
  id?: string; // optional if API provides
  title: string;
  description: { html?: string } | string;
  price: number;
  score: number;
  discountValue: number;
  releaseDate: string | number | Date | null;
  genre: string | string[] | null;
  developer: Developer;
  imageList: ImageRef[];
};
