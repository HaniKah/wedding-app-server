import { StepsDto } from '../types/planner/steps.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

export async function dummySteps(): Promise<StepsDto> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  //
  // return {
  //   [WeddingSteps.Date]: {
  //     title: 'Date',
  //     description: 'Date description',
  //     fullfilled: true,
  //     step: WeddingSteps.Date,
  //   },
  //   [WeddingSteps.Host]: {
  //     title: 'Host',
  //     description: 'Host description',
  //     fullfilled: false,
  //     step: WeddingSteps.Host,
  //   },
  //   [WeddingSteps.Dress]: {
  //     title: 'Dress',
  //     description: 'Dress description',
  //     fullfilled: false,
  //     step: WeddingSteps.Dress,
  //   },
  //
  //   [WeddingSteps.Photographer]: {
  //     title: 'Photographer',
  //     description: 'Photographer description',
  //     fullfilled: false,
  //     step: WeddingSteps.Photographer,
  //   },
  //   [WeddingSteps.Dj]: {
  //     title: 'Dj',
  //     description: 'Dj description',
  //     fullfilled: false,
  //     step: WeddingSteps.Dj,
  //   },
  // };
  return {
    progress: 10,
    steps: [
      {
        title: 'Date',
        description: 'Date description',
        fullfilled: new Date(),
        step: WeddingSteps.Date,
      },
      {
        title: 'Host',
        description: 'Host description',
        fullfilled: {
          placeId: 'ChIJ51i9R_pfGxUR7vY7QzR16FA',
          placeName: 'Host host host',
        },
        step: WeddingSteps.Host,
      },
      {
        title: 'Dress',
        description: 'Dress description',
        fullfilled: null,
        step: WeddingSteps.Dress,
      },

      {
        title: 'Photographer',
        description: 'Photographer description',
        fullfilled: null,
        step: WeddingSteps.Photographer,
      },
      {
        title: 'Dj',
        description: 'Dj description',
        fullfilled: null,
        step: WeddingSteps.Dj,
      },
    ],
  };
}
