export class PhotosDto {
  id: number;
  uri: string;
  ratio: number;
  blurhash: string;
}
export class PhotosViewModel {
  result: PhotosDto[];
}
