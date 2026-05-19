import { HttpService } from '@nestjs/axios';
import type { ConfigType } from '@nestjs/config';
import GoogleApiConfig from './config/google-api.config';
import { firstValueFrom } from 'rxjs';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  GoogleLikelihood,
  GoogleVisionResponses,
} from '../types/google/vision.dto';

@Injectable()
export class GoogleVisionApiService {
  // private readonly client = new vision.ImageAnnotatorClient();
  // constructor(
  //   @Inject(googleApiConfig.KEY)
  //   private googleApi: ConfigType<typeof googleApiConfig>,
  // ) {
  //   this.client = new vision.ImageAnnotatorClient({
  //     credentials: {
  //       private_key: this.googleApi.visionPrivateKey,
  //       client_email: this.googleApi.visionClientEmail,
  //     },
  //     projectId: this.googleApi.projectId,
  //   });
  // }
  // public async isApproved(image: string): Promise<boolean> {
  //   try {
  //     const [result] = await this.client.safeSearchDetection({
  //       image: {
  //         content: image,
  //       },
  //     });
  //     return (
  //       result.safeSearchAnnotation.adult === 'VERY_LIKELY' &&
  //       result.safeSearchAnnotation.violence === 'VERY_LIKELY'
  //     );
  //   } catch {
  //     throw new UnprocessableEntityException(
  //       "Photo couldn't be uploaded for the following reason : Detection not completed, not safe for upload",
  //     );
  //   }
  // }
  constructor(
    @Inject(GoogleApiConfig.KEY)
    private readonly googleApiConfig: ConfigType<typeof GoogleApiConfig>,
    private readonly httpService: HttpService,
  ) {}
  public async isApproved(image: string): Promise<boolean> {
    const body = {
      requests: [
        {
          image: {
            content: image,
          },
          features: [
            {
              type: 'SAFE_SEARCH_DETECTION',
            },
          ],
        },
      ],
    };
    const { data }: { data: GoogleVisionResponses } = await firstValueFrom(
      this.httpService.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.googleApiConfig.visionApiKey}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            Referer: this.googleApiConfig.baseUrl,
          },
        },
      ),
    );
    if (
      data.responses[0]?.safeSearchAnnotation?.adult &&
      data.responses[0]?.safeSearchAnnotation?.violence
    ) {
      return (
        data.responses[0]?.safeSearchAnnotation?.adult ===
          GoogleLikelihood.VERY_UNLIKELY &&
        data.responses[0]?.safeSearchAnnotation?.violence ===
          GoogleLikelihood.VERY_UNLIKELY
      );
    } else {
      throw new UnprocessableEntityException(
        'Detection not completed, not safe for upload',
      );
    }
  }
}
