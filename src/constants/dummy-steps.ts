import { StepsDto } from '../types/places/steps.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

export async function dummySteps(): Promise<Record<WeddingSteps, StepsDto>> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    [WeddingSteps.Date]: {
      title: 'Date',
      description: 'Date description',
      fullfilled: true,
      step: WeddingSteps.Date,
    },
    [WeddingSteps.Host]: {
      title: 'Host',
      description: 'Host description',
      fullfilled: false,
      step: WeddingSteps.Host,
    },
    [WeddingSteps.Dress]: {
      title: 'Dress',
      description: 'Dress description',
      fullfilled: false,
      step: WeddingSteps.Dress,
    },

    [WeddingSteps.Photographer]: {
      title: 'Photographer',
      description: 'Photographer description',
      fullfilled: false,
      step: WeddingSteps.Photographer,
    },
    [WeddingSteps.Dj]: {
      title: 'Dj',
      description: 'Dj description',
      fullfilled: false,
      step: WeddingSteps.Dj,
    },
  };
}
