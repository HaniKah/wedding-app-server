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
    progress: 0.3,
    steps: [
      {
        title: 'Date',
        description: 'Date description',
        fullfilled: true,
        step: WeddingSteps.Date,
        note: '23.08.2026',
      },
      {
        title: 'Host',
        description: 'Host description',
        fullfilled: true,
        step: WeddingSteps.Host,
        note: 'Fairmont wedding hall',
      },
      {
        title: 'Dress',
        description: 'Dress description',
        fullfilled: false,
        step: WeddingSteps.Dress,
        note: 'make sure its worth it',
      },

      {
        title: 'Photographer',
        description: 'Photographer description',
        fullfilled: false,
        step: WeddingSteps.Photographer,
        note: 'you can do it',
      },
      {
        title: 'Dj',
        description: 'Dj description',
        fullfilled: false,
        step: WeddingSteps.Dj,
        note: 'keep going',
      },
    ],
  };
}
