import { WeddingSteps } from '../general/wedding-steps-enum.dto';

export class PackagesDto {
  budget: string;
  includedSteps: WeddingSteps[];
}

export class GeneratePackagesRequest {
  budget: number;
  includedSteps: WeddingSteps[];
}
