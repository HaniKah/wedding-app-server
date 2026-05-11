import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';
import sharp, { OutputInfo } from 'sharp';
import { PhotosDto } from '../types/planner/photos.dto';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';

@Injectable()
export class PhotosService {
  constructor(
    private readonly minioService: MinioService,
    private readonly photosRepositoryService: PhotosRepositoryService,
  ) {}

  public async hasPhotos(placeId: number): Promise<boolean> {
    return await this.photosRepositoryService.photoExists(placeId);
  }

  public async getMainPhotoOrFirstByPlaceId(
    placeId: number,
    photoSize: PhotoSize,
  ): Promise<string> {
    const photoRecord = await this.photosRepositoryService.getMainPhoto(
      placeId,
      photoSize,
    );
    if (photoRecord) {
      return await this.getObject(
        photoRecord.objectKey,
        photoRecord.bucketName,
      );
    } else {
      const photos = await this.photosRepositoryService.getPhotosByPlaceId(
        placeId,
        photoSize,
      );
      if (photos.length > 0) {
        return await this.getObject(photos[0].objectKey, photos[0].bucketName);
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
    return Promise.all(
      photos.map(async (p) => {
        const uri: string = await this.getObject(p.objectKey, p.bucketName);
        return {
          id: p.photoId,
          uri: uri,
          ratio: p.ratio,
        };
      }),
    );
  }

  public async uploadFiles(
    placeId: number,
    files: Array<Express.Multer.File>,
    bucketName: BucketName,
  ) {
    const exists: boolean = await this.minioService.minio.bucketExists(
      BucketName.Listings,
    );
    if (!exists) await this.minioService.minio.makeBucket(BucketName.Listings);

    for (const file of files) {
      const { id } = await this.photosRepositoryService.createPhoto({
        placeId: placeId,
        bucketName: bucketName,
      });

      await this.createVariants(
        [PhotoSize.Image, PhotoSize.Medium, PhotoSize.Thumbnail],
        file,
        placeId,
        bucketName,
        id,
      );
    }
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

  private async getObject(
    objectKey: string,
    bucketName: BucketName,
  ): Promise<string> {
    return await this.minioService.minio.presignedGetObject(
      bucketName,
      objectKey,
      3600,
    );
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
    await Promise.all(
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
        await this.photosRepositoryService.createPhotoVariant({
          photoId: photoId,
          objectKey: objectName,
          variant: v,
          ratio: info.width / info.height,
        });
      }),
    );
  }
}
