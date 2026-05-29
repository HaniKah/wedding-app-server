import { Test, TestingModule } from '@nestjs/testing';
import { PlacesService } from '../src/places/places.service';
import { PlacesRepositoryService } from '../src/places/places.repository.service';
import { PhotosService } from '../src/photos/photos.service';
import { DbService } from '../src/db/db.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PriceType, UpdateStep } from '../src/types/places/places.dto';
import { Categories } from '../src/types/general/categories';
import { CountryCode } from '../src/types/general/countries.dto';

describe('PlacesService (Integration)', () => {
  let service: PlacesService;
  let dbService: DbService;
  let testUserId: number;

  const mockPhotosService = {
    getMainPhotoOrFirstByPlaceId: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [
        PlacesService,
        PlacesRepositoryService,
        DbService,
        { provide: PhotosService, useValue: mockPhotosService },
      ],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
    dbService = module.get<DbService>(DbService);

    // Ensure we are using a test database
    const dbUrl: string = module
      .get<ConfigService>(ConfigService)
      .get('DATABASE_URL');

    if (!dbUrl || !dbUrl.includes('postgres_test')) {
      // Logic to prevent running against production if no test DB is set
      throw new Error('DATABASE_URL must be a test database');
    }

    // Clean up and Setup test user

    await dbService.db.deleteFrom('places').execute();
    await dbService.db.deleteFrom('users').execute();

    const user = await dbService.db
      .insertInto('users')
      .values({
        email: 'test@example.com',
        role: 'Vendor' as any,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    testUserId = user.id;
  });

  afterAll(async () => {
    await dbService.db.destroy();
  });

  describe('createPlace and getPlaceDetails', () => {
    it('should create a place and retrieve its details with features', async () => {
      // 1. Create a place
      const createReq = {
        placeInfo: {
          name: 'Test Venue',
          category: Categories.Host,
          phoneNumber: '123456789',
          minPrice: '100',
          maxPrice: '500',
          priceType: PriceType.PerPerson,
        },
        location: {
          city: 'Amman',
          countryCode: CountryCode.JO,
        },
      };

      const createdPlace = await service.createPlace(testUserId, createReq);
      expect(createdPlace.id).toBeDefined();
      expect(createdPlace.name).toBe(createReq.placeInfo.name);

      // 2. Add features via editPlace
      const featuresReq = {
        id: createdPlace.id,
        updateStep: UpdateStep.AddFeatures,
        features: {
          category: Categories.Host,
          features: {
            capacity: 200,
            outdoor: true,
            rent: true, // Should be filtered out for Host category
          },
        },
      };

      await service.editPlace(featuresReq as any);

      // 3. Get details and verify JSONB integrity and normalization
      const details = await service.getPlaceDetails(createdPlace.id);

      expect(details.features).toBeDefined();
      expect(details.features.capacity).toBe(200);
      expect(details.features.outdoor).toBe(true);
      // 'rent' should be undefined because it's not in the Host category normalization
      expect(details.features.rent).toBeUndefined();
    });
  });

  describe('editPlace with different categories', () => {
    it('should normalize features based on category when editing', async () => {
      // Create a place with category Dress
      const createReq = {
        placeInfo: {
          name: 'Boutique',
          category: Categories.Dress,
          phoneNumber: '987654321',
          minPrice: '50',
          maxPrice: '200',
          priceType: PriceType.PerItem,
        },
        location: {
          city: 'Amman',
          countryCode: CountryCode.JO,
        },
      };

      const createdPlace = await service.createPlace(testUserId, createReq);

      // Add features for Dress
      const featuresReq = {
        id: createdPlace.id,
        updateStep: UpdateStep.AddFeatures,
        features: {
          category: Categories.Dress,
          features: {
            rent: true,
            capacity: 50, // Should be filtered out for Dress
          },
        },
      };

      await service.editPlace(featuresReq as any);

      const details = await service.getPlaceDetails(createdPlace.id);

      expect(details.features.rent).toBe(true);
      expect(details.features.capacity).toBeUndefined();
    });
  });
});
