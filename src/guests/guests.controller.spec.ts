import { Test, TestingModule } from '@nestjs/testing';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';
import {
  AddGuestRequest,
  CoupleSide,
  UpdateGuestRequest,
} from '../types/guests/guests.dto';

describe('GuestsController', () => {
  let controller: GuestsController;

  const mockGuestsService = {
    addGuest: jest.fn(),
    updateGuest: jest.fn(),
  };

  // Test fixture factories
  const createAddGuestRequest = (
    overrides?: Partial<AddGuestRequest>,
  ): AddGuestRequest => ({
    name: 'Alice Johnson',
    phoneNumber: '5551234567',
    coupleSide: CoupleSide.Bride,
    ...overrides,
  });

  const createUpdateGuestRequest = (
    overrides?: Partial<UpdateGuestRequest>,
  ): UpdateGuestRequest => ({
    id: 1,
    name: 'Alice Johnson',
    phoneNumber: '5551234567',
    coupleSide: CoupleSide.Bride,
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestsController],
      providers: [
        {
          provide: GuestsService,
          useValue: mockGuestsService,
        },
      ],
    }).compile();

    controller = module.get<GuestsController>(GuestsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addGuest', () => {
    it('should add a new guest', async () => {
      mockGuestsService.addGuest.mockResolvedValue(undefined);

      await controller.addGuest(createAddGuestRequest());

      expect(mockGuestsService.addGuest).toHaveBeenCalledWith(
        createAddGuestRequest(),
      );
      expect(mockGuestsService.addGuest).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from the service', async () => {
      const error = new Error('Guest already exists');
      mockGuestsService.addGuest.mockRejectedValue(error);

      await expect(
        controller.addGuest(createAddGuestRequest()),
      ).rejects.toThrow('Guest already exists');
      expect(mockGuestsService.addGuest).toHaveBeenCalledWith(
        createAddGuestRequest(),
      );
    });
  });
  describe('updateGuest', () => {
    it("should update an existing guest's info", async () => {
      mockGuestsService.updateGuest.mockResolvedValue(undefined);
      await controller.updateGuest(createUpdateGuestRequest());
      expect(mockGuestsService.updateGuest).toHaveBeenCalledWith(
        createUpdateGuestRequest(),
      );
      expect(mockGuestsService.updateGuest).toHaveBeenCalledTimes(1);
    });
  });
});
