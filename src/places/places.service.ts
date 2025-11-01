import { Injectable } from '@nestjs/common';
import { CreatePlaceDto, CreatePlaceRequest } from '../types/places/places.dto';
import { PlacesRepositoryService } from './places.repository.service';
import { MinioService } from '../minio/minio.service';
import { v4 } from 'uuid';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';
import sharp from 'sharp';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepositoryService: PlacesRepositoryService,
    private readonly minioService: MinioService,
  ) {}
  public async createPlace(
    userId: number,
    data: CreatePlaceRequest,
  ): Promise<CreatePlaceDto> {
    const placeRecord = await this.placesRepositoryService.createPlace({
      userId: userId,
      step: data.type,
      name: data.placeInfo.name,
      phoneNumber: data.placeInfo.phoneNumber,
      streetName: data.location?.streetName,
      lng: data.location?.lng,
      lat: data.location?.lat,
      city: data.location?.city,
      googleId: data.location?.googleId,
      country: data.location?.country,
      postalCode: data.location?.postalCode,
      facebook: data.placeInfo.facebook,
      instagram: data.placeInfo.instagram,
      tiktok: data.placeInfo.tiktok,
      website: data.placeInfo.website,
    });
    return {
      id: placeRecord.id,
    };
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
      await this.uploadObject(placeId, file, BucketName.PlacesOriginal);
    }
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
    let fileBuffer: Buffer<ArrayBufferLike>;
    let fileExtension: string;
    const fileSize: number = file.size; // todo : to be changed for creating thumbnails

    if (file.mimetype === 'image/heic') {
      fileBuffer = await sharp(file.buffer).jpeg().toBuffer();
      fileExtension = 'jpeg';
    } else {
      fileBuffer = file.buffer;
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
      fileBuffer,
      fileSize,
      metadata,
    );
  }
}
