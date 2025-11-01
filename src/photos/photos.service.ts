import { Injectable } from '@nestjs/common';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';
import convert from 'heic-convert';
import { v4 } from 'uuid';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';

@Injectable()
export class PhotosService {
  constructor(
    private readonly minioService: MinioService,
    private readonly photosRepositoryService: PhotosRepositoryService,
  ) {}

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
    let fileBuffer: ArrayBufferLike;
    let fileExtension: string;
    const fileSize: number = file.size; // todo : to be changed for creating thumbnails

    if (file.mimetype === 'image/heic') {
      fileBuffer = await convert({
        buffer: file.buffer.buffer, // the HEIC file buffer
        format: 'JPEG', // output format
        quality: 1, // the jpeg compression quality, between 0 and 1
      });

      fileExtension = 'jpeg';
    } else {
      fileBuffer = file.buffer.buffer;
      fileExtension = file.originalname.split('.').pop();
    }

    const uuid = v4();
    const objectName = `${PhotoSize.Original}/${placeId}/${uuid}.${fileExtension}`;
    const metadata = {
      fileName: file.filename,
      size: fileSize,
      photoSize: PhotoSize.Original,
    };
    await this.minioService.minio.putObject(
      bucketName,
      objectName,
      Buffer.from(fileBuffer),
      fileSize,
      metadata,
    );
    return objectName;
  }
}
