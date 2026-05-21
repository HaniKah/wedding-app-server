import { PhotoSize } from '../photos/photos.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PhotosDto {
  id: number;
  uri: string;
  ratio: number;
  blurhash: string;
  @ApiProperty({ enum: PhotoSize, enumName: 'PhotoSize' })
  photoSize: PhotoSize;
}
export class PhotosViewModel {
  result: PhotosDto[];
}
