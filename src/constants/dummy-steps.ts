import { StepsBasicInfo, StepsDto } from '../types/places/steps.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

export async function dummySteps(): Promise<StepsDto> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // const steps: WeddingSteps[] = Object.values(WeddingSteps);
  // const currentStepIndex: number = Math.floor(Math.random() * steps.length);
  const steps: StepsBasicInfo[] = [
    { step: WeddingSteps.Date, title: 'Date', description: 'Date description' },
    { step: WeddingSteps.Host, title: 'Host', description: 'Host description' },
    {
      step: WeddingSteps.Dress,
      title: 'Dress',
      description: 'Dress description',
    },
    {
      step: WeddingSteps.Photographer,
      title: 'Photographer',
      description: 'Photographer description',
    },
    { step: WeddingSteps.Dj, title: 'Dj', description: 'Dj description' },
  ];

  return {
    currentStep: WeddingSteps.Host,
    steps: steps,
  };
}
