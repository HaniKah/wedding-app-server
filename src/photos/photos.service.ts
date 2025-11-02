import { Injectable } from '@nestjs/common';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';
import { v4 } from 'uuid';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';

@Injectable()
export class PhotosService {
  constructor(
    private readonly minioService: MinioService,
    private readonly photosRepositoryService: PhotosRepositoryService,
  ) {}

  public async getPhotosByPlaceId(placeId: number): Promise<string[]> {
    const photos =
      await this.photosRepositoryService.getPhotosByPlaceId(placeId);
    return Promise.all(
      photos.map(async (p) => {
        return await this.getObject(p.objectKey, p.bucketName);
      }),
    );
  }

  public async uploadFiles(placeId: number, files: Array<Express.Multer.File>) {
    const bucketExists: boolean = await this.minioService.minio.bucketExists(
      BucketName.PlacesOriginal,
    );

    if (!bucketExists) {
      await this.minioService.minio.makeBucket(
        BucketName.PlacesOriginal,
        'jordan',
      );
    }
    for (const file of files) {
      const objectName: string = await this.uploadObject(
        placeId,
        file,
        BucketName.PlacesOriginal,
      );
      await this.storePhotoInfo(placeId, objectName, BucketName.PlacesOriginal);
    }
  }
  private async storePhotoInfo(
    placeId: number,
    objectName: string,
    bucketName: BucketName,
    photoSize: PhotoSize = PhotoSize.Original,
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
    bucketName: string,
  ): Promise<string> {
    return await this.minioService.minio.presignedGetObject(
      bucketName,
      objectKey,
    );
  }

  private async uploadObject(
    placeId: number,
    file: Express.Multer.File,
    bucketName: string,
  ) {
    const fileExtension: string = file.originalname.split('.').pop();

    const uuid = v4();
    const objectName = `${PhotoSize.Original}/${placeId}/${uuid}.${fileExtension}`;
    const metadata = {
      fileName: file.filename,
      size: file.size, // todo : to be changed for creating thumbnails
      photoSize: PhotoSize.Original,
    };
    await this.minioService.minio.putObject(
      bucketName,
      objectName,
      file.buffer,
      file.size,
      metadata,
    );
    return objectName;
  }
}
