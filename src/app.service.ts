import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello from the ${process.env.NODE_ENV} environment`;
  }
}
