import { StepsDto } from '../types/places/steps.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

export async function dummySteps(): Promise<StepsDto> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const steps: WeddingSteps[] = Object.values(WeddingSteps);
  const currentStepIndex: number = Math.floor(
    Math.random() * (steps.length + 1),
  );
  return {
    currentStep: steps[currentStepIndex],
    steps: steps,
  };
}
