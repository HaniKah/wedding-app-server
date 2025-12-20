import { Controller, Get, Query } from '@nestjs/common';
import { GeneratePackagesRequest } from '../types/packages/packages.dto';

@Controller('packages')
export class PackagesController {
  @Get('generatePackage')
  public async generatePackages(@Query() query: GeneratePackagesRequest) {}
}
