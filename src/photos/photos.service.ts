import { Injectable } from '@nestjs/common';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';
import { v4 } from 'uuid';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';
import sharp from 'sharp';
import { PhotosDto } from '../types/planner/photos.dto';

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
          uri: uri,
        };
      }),
    );
  }

  public async uploadFiles(
    placeId: number,
    files: Array<Express.Multer.File>,
    bucketName: BucketName,
    photoSize: PhotoSize[],
  ) {
    //check bucket exists
    const bucketExists: boolean = await this.minioService.minio.bucketExists(
      BucketName.Places,
    );

    if (!bucketExists) {
      await this.minioService.minio.makeBucket(BucketName.Places, 'jordan');
    }

    for (const size of photoSize) {
      for (const file of files) {
        const objectName: string = await this.uploadObject(
          placeId,
          file,
          bucketName,
          size,
        );
        await this.storePhotoInfo(placeId, objectName, bucketName, size);
      }
    }
  }

  // private fallbackPhoto(): string {
  //   //todo : to be changed
  //   return 'https://placehold.co/600x400';
  // }

  private async storePhotoInfo(
    placeId: number,
    objectName: string,
    bucketName: BucketName,
    photoSize: PhotoSize,
  ) {
    await this.photosRepositoryService.createPhoto({
      placeId: placeId,
      objectKey: objectName,
      size: photoSize,
      bucketName: bucketName,
    });
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
    placeId: number,
    file: Express.Multer.File,
    bucketName: string,
    photoSize: PhotoSize,
  ) {
    const fileExtension: string = file.originalname.split('.').pop();
    const uuid = v4();
    const objectName = `${placeId}/${photoSize}/${uuid}.${fileExtension}`;
    const { data, info } = await this.resizeFile(photoSize, file);

    const metadata = {
      fileName: file.filename,
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

  private async resizeFile(fileSize: PhotoSize, file: Express.Multer.File) {
    let width: number;
    switch (fileSize) {
      case PhotoSize.Large:
        width = 1200;
        break;
      case PhotoSize.Medium:
        width = 600;
        break;
      case PhotoSize.Small:
        width = 300;
    }
    return await sharp(file.buffer)
      .resize({ width: width, withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true });
  }
}
