export class VideosDto {
  id: number;
  uri: string;
  posterUri: string | null;
  ratio: number | null;
  blurhash: string | null;
  durationMs: number | null;
  isMain: boolean;
}

export class VideosViewModel {
  result: VideosDto[];
}

export enum HeroMediaType {
  Photo = 'Photo',
  Video = 'Video',
}

export class HeroMediaItemDto {
  id: number;
  type: HeroMediaType;
  uri: string;
  posterUri: string | null;
  blurhash: string | null;
  ratio: number | null;
  isMain: boolean;
}
