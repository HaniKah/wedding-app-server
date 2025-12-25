import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(`get hello reached on the ${process.env.NODE_ENV} environment`);
    return `Hello from the ${process.env.NODE_ENV} environment`;
  }
}
