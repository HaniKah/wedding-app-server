import { PlannerController } from '../planner.controller';
import { Test } from '@nestjs/testing';
import { PlannerService } from '../planner.service';
import { PlacesViewModel } from '../../types/planner/places.dto';
import {
  getPlaceRequestStub,
  placesViewModelStub,
} from './stubs/planner.stubs';

jest.mock('../planner.service');

describe('PlannerController', () => {
  let plannerController: PlannerController;
  let plannerService: PlannerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PlannerController],
      providers: [PlannerService],
    }).compile();

    plannerController = moduleRef.get<PlannerController>(PlannerController);
    plannerService = moduleRef.get<PlannerService>(PlannerService);
    jest.clearAllMocks();
  });
  describe('getPlaces', () => {
    describe('when getPlaces is called', () => {
      let places: PlacesViewModel;

      beforeEach(async () => {
        places = await plannerController.getPlaces(
          getPlaceRequestStub().offset,
          getPlaceRequestStub().countryCode,
          getPlaceRequestStub().step,
          getPlaceRequestStub().searchQuery,
        );
      });
      // we could have written expect(plannerSerivce.getplaces).tohavebeen... but because of esLint errors , this is the friendly way to do it
      test('then it should call plannerService', () => {
        expect(jest.spyOn(plannerService, 'getPlaces')).toHaveBeenCalledWith(
          getPlaceRequestStub().countryCode,
          getPlaceRequestStub().offset,
          getPlaceRequestStub().searchQuery,
          getPlaceRequestStub().step,
        );
      });

      test('then it should return the result of getPlaces', () => {
        expect(places).toEqual(placesViewModelStub());
      });
    });
  });
});
