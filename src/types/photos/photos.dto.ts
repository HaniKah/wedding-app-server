import { OutputInfo } from 'sharp';

export enum PhotoSize {
  Thumbnail = 'Thumbnail',
  Image = 'Image',
}

// this enum is used to identify the bucket name , dont delete any of existing bucket name
export enum BucketName {
  Listings = 'Listings',
}

export interface SharpVariants {
  data: Buffer;
  info: OutputInfo;
  size: PhotoSize;
}
