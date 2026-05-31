import { PlacesService } from './places.service';
import { PlacesRepositoryService } from './places.repository.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  UpdatePlaceRequest,
  UpdateStep,
  VendorPlaceDetailsDto,
} from '../types/places/places.dto';
import { Categories } from '../types/general/categories';
import { PhotosService } from '../photos/photos.service';
import { normalizePlacesFeatures } from '../types/places/features.dto';

jest.mock('../types/places/features.dto', () => {
  const actual = jest.requireActual<
    typeof import('../types/places/features.dto')
  >('../types/places/features.dto');

  return {
    __esModule: true,
    ...actual,
    normalizePlacesFeatures: jest.fn(actual.normalizePlacesFeatures),
  };
}); // todo: this is mocking the module , but also running the actual function , just to be able to see if it has been called , does it make any sense ?

describe('PlacesService', () => {
  let placesService: PlacesService;

  const mockPlacesRepositoryService = {
    updatePlace: jest.fn(),
  };

  const mockPhotosService = {
    getMainPhotoOrFirstByPlaceId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        {
          provide: PlacesRepositoryService,
          useValue: mockPlacesRepositoryService,
        },
        {
          provide: PhotosService,
          useValue: mockPhotosService,
        },
      ],
    }).compile();

    placesService = module.get<PlacesService>(PlacesService);
  });

  it('should be defined', () => {
    expect(placesService).toBeDefined();
  });

  it('should normalize host features before updating the place', async () => {
    jest.spyOn(placesService, 'getPlaceDetails').mockResolvedValue({
      id: 1,
    } as VendorPlaceDetailsDto);

    const request: UpdatePlaceRequest = {
      id: 1,
      updateStep: UpdateStep.AddFeatures,
      features: {
        category: Categories.Host,
        features: {
          capacity: 200,
          outdoor: true,
          rent: true,
        },
      },
    };

    await placesService.editPlace(request);

    expect(mockPlacesRepositoryService.updatePlace).toHaveBeenCalledWith(
      request.id,
      {
        features: {
          capacity: 200,
          outdoor: true,
          indoor: undefined,
        },
      },
    );

    expect(normalizePlacesFeatures).toHaveBeenCalledWith({
      category: request.features.category,
      features: request.features.features,
    });
  });
});
