import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import { MinioService } from '../minio/minio.service';
import { PhotosRepositoryService } from './photos.repository.service';
import { GoogleVisionApiService } from '../google-api/google-vision-api.service';
import PhotosConfig from './config/photos.config';
import { BucketName } from '../types/photos/photos.dto';
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
  let photoService: PhotosService;
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

    photoService = module.get<PhotosService>(PhotosService);
    minioService = module.get<MinioService>(MinioService);
    repositoryService = module.get<PhotosRepositoryService>(
      PhotosRepositoryService,
    );
    googleVisionService = module.get<GoogleVisionApiService>(
      GoogleVisionApiService,
    );
  });

  it('should be defined', () => {
    expect(photoService).toBeDefined();
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

      const result = await photoService.uploadFile(
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
        photoService.uploadFile(123, mockFile, BucketName.Listings),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(repositoryService.createPhoto).not.toHaveBeenCalled();
    });
  });
});
