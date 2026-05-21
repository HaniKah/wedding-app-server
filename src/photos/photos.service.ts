import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';
import sharp, { OutputInfo } from 'sharp';
import { PhotosDto } from '../types/planner/photos.dto';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';
import { encode } from 'blurhash';
import { GoogleVisionApiService } from '../google-api/google-vision-api.service';
import PhotosConfig from './config/photos.config';
import type { ConfigType } from '@nestjs/config';
import { v4 } from 'uuid';

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

  public async setMain(placeId: number, photoId: number): Promise<void> {
    await this.photosRepositoryService.setMainPhoto(placeId, photoId);
  }

  public async hasPhotos(placeId: number): Promise<boolean> {
    return await this.photosRepositoryService.photoExists(placeId);
  }

  public async getPhotoById(
    bucketName: BucketName,
    photoId: number,
    photoSize: PhotoSize,
  ): Promise<PhotosDto> {
    const variant = await this.photosRepositoryService.getVariantByPhotoId(
      photoId,
      photoSize,
    );

    if (!variant) {
      throw new NotFoundException(`Photo with ID ${photoId} not found`);
    }

    return this.constructPhotoDto(
      photoId,
      variant.ratio,
      variant.blurhash,
      variant.objectKey,
      bucketName,
      photoSize,
      variant.main,
    );
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
      return this.constructPhotoDto(
        photoRecord.photoId,
        photoRecord.ratio,
        photoRecord.blurhash,
        photoRecord.objectKey,
        photoRecord.bucketName,
        photoSize,
        photoRecord.main,
      );
    } else {
      return null;
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
      return this.constructPhotoDto(
        p.photoId,
        p.ratio,
        p.blurhash,
        p.objectKey,
        p.bucketName,
        photoSize,
        p.main,
      );
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
    const photos =
      await this.photosRepositoryService.getAllVariantsByPhotoId(photoId);
    if (photos.length > 0) {
      await Promise.all(
        photos.map(async (p) => {
          await this.minioService.minio.removeObject(p.bucketName, p.objectKey);
        }),
      );
      await this.photosRepositoryService.deletePhoto(photoId);
    }
  }

  public async getAvailablePhotosCount(placeId) {
    return await this.photosRepositoryService.getAvailablePhotosCount(placeId);
  }

  private constructPhotoDto(
    photoId: number,
    ratio: number,
    blurhash: string,
    objectKey: string,
    bucketName: BucketName,
    photoSize: PhotoSize,
    isMain: boolean,
  ): PhotosDto {
    return {
      id: photoId,
      uri: this.photosConfig.minioBaseUrl + bucketName + '/' + objectKey,
      ratio: ratio,
      blurhash: blurhash,
      photoSize: photoSize,
      isMain: isMain,
    };
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
    await this.photosRepositoryService.createPhotoVariants(images);
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
