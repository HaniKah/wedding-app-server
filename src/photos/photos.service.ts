import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';
import sharp, { OutputInfo } from 'sharp';
import { PhotosDto } from '../types/planner/photos.dto';
import {
  BucketName,
  PhotoSize,
  SharpVariants,
} from '../types/photos/photos.dto';

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
      const variants: SharpVariants[] = await this.createVariants(
        [PhotoSize.Image, PhotoSize.Thumbnail],
        file,
      );

      const { id } = await this.photosRepositoryService.createPhoto({
        placeId: placeId,
        bucketName: bucketName,
      });

      for (const v of variants) {
        const objectName: string = await this.uploadObject(
          file.originalname,
          placeId,
          bucketName,
          v.size,
          v.data,
          v.info,
        );

        const ratio = v.info.width / v.info.height;
        await this.photosRepositoryService.createPhotoVariant({
          photoId: id,
          objectKey: objectName,
          variant: v.size,
          ratio: ratio,
        });
      }
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

    const fileExtension: string = originalName.split('.').pop();

    const objectName = `${placeId}/${photoSize}/${uuid}.${fileExtension}`;

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
  ): Promise<Array<{ data: Buffer; info: OutputInfo; size: PhotoSize }>> {
    return Promise.all(
      variants.map(async (v) => {
        let width: number;
        switch (v) {
          case PhotoSize.Thumbnail:
            width = 300;
            break;
          case PhotoSize.Image:
            width = 1200;
            break;
        }

        const { data, info } = await sharp(file.buffer)
          .resize({ width: width, withoutEnlargement: true })
          .toBuffer({ resolveWithObject: true });

        return { data, info, size: v };
      }),
    );
  }
}
