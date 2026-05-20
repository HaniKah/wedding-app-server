import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';
import sharp, { OutputInfo } from 'sharp';
import { PhotosDto } from '../types/planner/photos.dto';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';
import { encode } from 'blurhash';
import { v4 } from 'uuid';
import { GoogleVisionApiService } from '../google-api/google-vision-api.service';
import PhotosConfig from './config/photos.config';
import type { ConfigType } from '@nestjs/config';

export interface PhotoWithBlurhash {
  uri: string;
  blurhash: string;
}

@Injectable()
export class PhotosService {
  constructor(
    private readonly minioService: MinioService,
    private readonly photosRepositoryService: PhotosRepositoryService,
    private readonly googleVisionApiService: GoogleVisionApiService,

    @Inject(PhotosConfig.KEY)
    private readonly photosConfig: ConfigType<typeof PhotosConfig>,
  ) {}

  public async hasPhotos(placeId: number): Promise<boolean> {
    return await this.photosRepositoryService.photoExists(placeId);
  }

  public async getPhotoById(
    bucketName: BucketName,
    photoId: number,
    photoSize: PhotoSize,
  ): Promise<PhotosDto> {
    const variant = await this.photosRepositoryService.getPhotoById(
      photoId,
      photoSize,
    );
    const obj = this.getPublicObject(variant.objectKey, bucketName);

    return {
      id: variant.photoId,
      uri: obj,
      ratio: variant.ratio,
      blurhash: variant.blurhash,
    };
  }

  public async getMainPhotoOrFirstByPlaceId(
    placeId: number,
    photoSize: PhotoSize,
  ): Promise<PhotoWithBlurhash | null> {
    const photoRecord = await this.photosRepositoryService.getMainPhoto(
      placeId,
      photoSize,
    );
    if (photoRecord) {
      const uri = this.getPublicObject(
        photoRecord.objectKey,
        photoRecord.bucketName,
      );
      return {
        uri,
        blurhash: photoRecord.blurhash,
      };
    } else {
      const photos = await this.photosRepositoryService.getPhotosByPlaceId(
        placeId,
        photoSize,
      );
      if (photos.length > 0) {
        const uri = this.getPublicObject(
          photos[0].objectKey,
          photos[0].bucketName,
        );
        return {
          uri,
          blurhash: photos[0].blurhash,
        };
      } else {
        return null;
      }
    }
  }

  public async getPhotosByPlaceId(
    placeId: number,
    photoSize: PhotoSize,
  ): Promise<PhotosDto[]> {
    const photos = await this.photosRepositoryService.getPhotosByPlaceId(
      placeId,
      photoSize,
    );
    return photos.map((p) => {
      const uri: string = this.getPublicObject(p.objectKey, p.bucketName);
      return {
        id: p.photoId,
        uri: uri,
        ratio: p.ratio,
        blurhash: p.blurhash,
      };
    });
  }

  public async uploadFile(
    placeId: number,
    file: Express.Multer.File,
    bucketName: BucketName,
  ): Promise<PhotosDto> {
    const isApproved = await this.googleVisionApiService.isApproved(
      file.buffer.toString('base64'),
    );

    if (!isApproved)
      throw new UnprocessableEntityException(
        'Probable adult or violent content',
      );

    const blurhash = await this.generateBlurhash(file.buffer);

    const { id } = await this.photosRepositoryService.createPhoto({
      placeId: placeId,
      bucketName: bucketName,
      blurhash: blurhash,
    });

    await this.createVariants(
      [PhotoSize.Image, PhotoSize.Medium, PhotoSize.Thumbnail],
      file,
      placeId,
      bucketName,
      id,
    );

    return await this.getPhotoById(
      BucketName.Listings,
      id,
      PhotoSize.Thumbnail,
    );
  }

  public async deletePhoto(photoId: number) {
    const photos = await this.photosRepositoryService.getPhotosById(photoId);
    if (photos.length > 0) {
      await Promise.all(
        photos.map(async (p) => {
          await this.minioService.minio.removeObject(p.bucketName, p.objectKey);
        }),
      );
      await this.photosRepositoryService.deletePhoto(photoId);
    }
  }

  public async getAvailablePhotosNumber(placeId) {
    return this.photosRepositoryService.getAvailablePhotosNumber(placeId);
  }

  private getPublicObject(objectKey: string, bucketName: BucketName): string {
    return this.photosConfig.minioBaseUrl + bucketName + '/' + objectKey;
    // return await this.minioService.minio.presignedGetObject(
    //   bucketName,
    //   objectKey,
    //   3600,
    // );
  }

  private async uploadObject(
    originalName: string,
    placeId: number,
    bucketName: string,
    photoSize: PhotoSize,
    data: Buffer,
    info: OutputInfo,
  ) {
    const uuid = v4();

    // const fileExtension: string = originalName.split('.').pop();

    const objectName = `${placeId}/${photoSize}/${uuid}.webp`;

    const metadata = {
      fileName: originalName,
      photoSize: photoSize,
      size: info.size,
    };

    await this.minioService.minio.putObject(
      bucketName,
      objectName,
      data,
      info.size,
      metadata,
    );
    return objectName;
  }

  private async createVariants(
    variants: PhotoSize[],
    file: Express.Multer.File,
    placeId: number,
    bucketName: string,
    photoId: number,
  ): Promise<void> {
    const input = sharp(file.buffer).rotate();
    const images = await Promise.all(
      variants.map(async (v) => {
        let width: number;
        let quality: number;
        let effort: number;
        switch (v) {
          case PhotoSize.Thumbnail:
            width = 300;
            quality = 72;
            effort = 3;
            break;
          case PhotoSize.Medium:
            width = 800;
            quality = 82;
            effort = 4;
            break;
          case PhotoSize.Image:
            width = 1400;
            quality = 88;
            effort = 4;
            break;
        }

        const { data, info } = await input
          .clone()
          .resize({ width: width, withoutEnlargement: true, fit: 'inside' })
          .webp({ quality: quality, effort: effort })
          .toBuffer({ resolveWithObject: true });

        const objectName: string = await this.uploadObject(
          file.originalname,
          placeId,
          bucketName,
          v,
          data,
          info,
        );
        return {
          photoId: photoId,
          objectKey: objectName,
          variant: v,
          ratio: info.width / info.height,
        };
      }),
    );
    await this.photosRepositoryService.createPhotoVariant(images);
  }

  private async generateBlurhash(buffer: Buffer): Promise<string> {
    const { data, info } = await sharp(buffer)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });

    return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
  }
}
