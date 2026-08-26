import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller('.well-known')
export class WellKnownController {
  @Public()
  @Get('assetlinks.json')
  getAssetLinks() {
    return [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'com.hanikah.ghamrah',
          sha256_cert_fingerprints: [
            'DB:36:97:48:E2:A8:E6:C5:30:3E:BA:02:58:C5:09:6A:58:CC:EA:A7:1A:FC:B9:62:AC:B2:CA:94:9E:3B:66:68',
          ],
        },
      },
    ];
  }
}
