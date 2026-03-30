import { placesViewModelStub } from '../test/stubs/planner.stubs';

export const PlannerService = jest.fn().mockImplementation(() => ({
  getPlaces: jest.fn().mockResolvedValue(placesViewModelStub()),
}));
