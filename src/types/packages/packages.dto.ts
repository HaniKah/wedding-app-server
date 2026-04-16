import { Categories } from '../general/categories';

export class PackagesDto {
  budget: string;
  includedSteps: Categories[];
}

export class GeneratePackagesRequest {
  budget: number;
  includedSteps: Categories[];
}
