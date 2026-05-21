import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';
import { GoogleVisionApiService } from '../google-api/google-vision-api.service';
import PhotosConfig from './config/photos.config';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';
import { UnprocessableEntityException } from '@nestjs/common';

// Mock sharp
jest.mock('sharp', () => {
  const mSharp = {
    rotate: jest.fn().mockReturnThis(),
    clone: jest.fn().mockReturnThis(),
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue({
      data: Buffer.from('mockData'),
      info: { width: 100, height: 100, size: 1000 },
    }),
    raw: jest.fn().mockReturnThis(),
    ensureAlpha: jest.fn().mockReturnThis(),
  };
  return jest.fn(() => mSharp);
});

// Mock blurhash
jest.mock('blurhash', () => ({
  encode: jest.fn().mockReturnValue('mockBlurhash'),
}));

describe('PhotosService', () => {
  let service: PhotosService;
  let minioService: MinioService;
  let repositoryService: PhotosRepositoryService;
  let googleVisionService: GoogleVisionApiService;

  const mockMinio = {
    putObject: jest.fn(),
    removeObject: jest.fn(),
  };

  const mockRepositoryService = {
    createPhoto: jest.fn(),
    createPhotoVariants: jest.fn(),
    getPhotosByPlaceId: jest.fn(),
    getMainPhoto: jest.fn(),
    getVariantByPhotoId: jest.fn(),
    getAllVariantsByPhotoId: jest.fn(),
    deletePhoto: jest.fn(),
    getAvailablePhotosCount: jest.fn(),
  };

  const mockGoogleVisionService = {
    isApproved: jest.fn(),
  };

  const mockPhotosConfig = {
    minioBaseUrl: 'http://localhost:9000/',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: MinioService,
          useValue: { minio: mockMinio },
        },
        {
          provide: PhotosRepositoryService,
          useValue: mockRepositoryService,
        },
        {
          provide: GoogleVisionApiService,
          useValue: mockGoogleVisionService,
        },
        {
          provide: PhotosConfig.KEY,
          useValue: mockPhotosConfig,
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
    minioService = module.get<MinioService>(MinioService);
    repositoryService = module.get<PhotosRepositoryService>(
      PhotosRepositoryService,
    );
    googleVisionService = module.get<GoogleVisionApiService>(
      GoogleVisionApiService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    const mockFile = {
      buffer: Buffer.from('fakeImage'),
      originalname: 'test.jpg',
    } as Express.Multer.File;

    it('should upload a file and create variants if approved', async () => {
      googleVisionService.isApproved = jest.fn().mockResolvedValue(true);
      repositoryService.createPhoto = jest.fn().mockResolvedValue({ id: 1 });
      repositoryService.getVariantByPhotoId = jest.fn().mockResolvedValue({
        photoId: 1,
        ratio: 1,
        blurhash: 'mockBlurhash',
        objectKey: '1/thumbnail/uuid.webp',
        bucketName: BucketName.Listings,
      });

      const result = await service.uploadFile(
        123,
        mockFile,
        BucketName.Listings,
      );

      expect(googleVisionService.isApproved).toHaveBeenCalled();
      expect(repositoryService.createPhoto).toHaveBeenCalledWith({
        placeId: 123,
        bucketName: BucketName.Listings,
        blurhash: 'mockBlurhash',
      });
      expect(mockMinio.putObject).toHaveBeenCalledTimes(3); // 3 variants
      expect(repositoryService.createPhotoVariants).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        uri: 'http://localhost:9000/listings/1/thumbnail/uuid.webp',
        ratio: 1,
        blurhash: 'mockBlurhash',
      });
    });

    it('should throw UnprocessableEntityException if not approved', async () => {
      googleVisionService.isApproved = jest.fn().mockResolvedValue(false);

      await expect(
        service.uploadFile(123, mockFile, BucketName.Listings),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(repositoryService.createPhoto).not.toHaveBeenCalled();
    });
  });

  describe('deletePhoto', () => {
    it('should remove all variants from Minio and delete from DB', async () => {
      const mockVariants = [
        { bucketName: BucketName.Listings, objectKey: 'key1' },
        { bucketName: BucketName.Listings, objectKey: 'key2' },
      ];
      repositoryService.getAllVariantsByPhotoId = jest
        .fn()
        .mockResolvedValue(mockVariants);

      await service.deletePhoto(1);

      expect(mockMinio.removeObject).toHaveBeenCalledTimes(2);
      expect(mockMinio.removeObject).toHaveBeenCalledWith(
        BucketName.Listings,
        'key1',
      );
      expect(mockMinio.removeObject).toHaveBeenCalledWith(
        BucketName.Listings,
        'key2',
      );
      expect(repositoryService.deletePhoto).toHaveBeenCalledWith(1);
    });

    it('should do nothing if photo has no variants', async () => {
      repositoryService.getAllVariantsByPhotoId = jest
        .fn()
        .mockResolvedValue([]);

      await service.deletePhoto(1);

      expect(mockMinio.removeObject).not.toHaveBeenCalled();
      expect(repositoryService.deletePhoto).not.toHaveBeenCalled();
    });
  });

  describe('Retrieval logic', () => {
    it('getMainPhotoOrFirstByPlaceId should return photo DTO', async () => {
      repositoryService.getMainPhoto = jest.fn().mockResolvedValue({
        photoId: 1,
        ratio: 1.5,
        blurhash: 'hash',
        objectKey: 'key.webp',
        bucketName: BucketName.Listings,
      });

      const result = await service.getMainPhotoOrFirstByPlaceId(
        123,
        PhotoSize.Thumbnail,
      );

      expect(repositoryService.getMainPhoto).toHaveBeenCalledWith(
        123,
        PhotoSize.Thumbnail,
      );
      expect(result).toEqual({
        id: 1,
        uri: 'http://localhost:9000/listings/key.webp',
        ratio: 1.5,
        blurhash: 'hash',
      });
    });

    it('getPhotoById should return photo DTO', async () => {
      repositoryService.getVariantByPhotoId = jest.fn().mockResolvedValue({
        photoId: 1,
        ratio: 1.5,
        blurhash: 'hash',
        objectKey: 'key.webp',
        bucketName: BucketName.Listings,
      });

      const result = await service.getPhotoById(
        BucketName.Listings,
        1,
        PhotoSize.Image,
      );

      expect(repositoryService.getVariantByPhotoId).toHaveBeenCalledWith(
        1,
        PhotoSize.Image,
      );
      expect(result).toEqual({
        id: 1,
        uri: 'http://localhost:9000/listings/key.webp',
        ratio: 1.5,
        blurhash: 'hash',
      });
    });
  });

  describe('hasPhotos', () => {
    it('should return true if repository has photos', async () => {
      repositoryService.photoExists = jest.fn().mockResolvedValue(true);
      const result = await service.hasPhotos(123);
      expect(repositoryService.photoExists).toHaveBeenCalledWith(123);
      expect(result).toBe(true);
    });

    it('should return false if repository has no photos', async () => {
      repositoryService.photoExists = jest.fn().mockResolvedValue(false);
      const result = await service.hasPhotos(123);
      expect(result).toBe(false);
    });
  });

  describe('getPhotosByPlaceId', () => {
    it('should return an array of photo DTOs', async () => {
      repositoryService.getPhotosByPlaceId = jest.fn().mockResolvedValue([
        {
          photoId: 1,
          ratio: 1,
          blurhash: 'h1',
          objectKey: 'k1.webp',
          bucketName: BucketName.Listings,
        },
        {
          photoId: 2,
          ratio: 2,
          blurhash: 'h2',
          objectKey: 'k2.webp',
          bucketName: BucketName.Listings,
        },
      ]);

      const result = await service.getPhotosByPlaceId(123, PhotoSize.Thumbnail);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  describe('getAvailablePhotosCount', () => {
    it('should return the count from repository', async () => {
      repositoryService.getAvailablePhotosCount = jest
        .fn()
        .mockResolvedValue({ count: 5 });
      const result = await service.getAvailablePhotosCount(123);
      expect(result).toEqual({ count: 5 });
    });
  });
});
