import { HttpService } from '@nestjs/axios';
import type { ConfigType } from '@nestjs/config';
import GoogleApiConfig from './config/google-api.config';
import { firstValueFrom } from 'rxjs';
import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  GoogleLikelihood,
  GoogleVisionResponses,
} from '../types/google/vision.dto';

/**
 * Service to interact with Google Cloud Vision API.
 */
@Injectable()
export class GoogleVisionApiService {
  private readonly logger = new Logger(GoogleVisionApiService.name);

  constructor(
    @Inject(GoogleApiConfig.KEY)
    private readonly googleApiConfig: ConfigType<typeof GoogleApiConfig>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Checks if an image is appropriate for upload based on Google Vision Safe Search.
   * @param image Base64 encoded image content.
   * @returns Promise<boolean> True if the image is considered safe.
   * @throws UnprocessableEntityException if the detection fails or content is inappropriate.
   */
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

    try {
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

      const annotation = data.responses?.[0]?.safeSearchAnnotation;

      if (!annotation) {
        this.logger.error(
          'Vision API response did not contain safeSearchAnnotation',
          JSON.stringify(data),
        );
        throw new UnprocessableEntityException(
          'Detection not completed, not safe for upload',
        );
      }

      const { adult, violence, medical, spoof, racy } = annotation;

      // Log the detection results for audit/debugging
      this.logger.debug(
        `SafeSearch results: adult=${adult}, violence=${violence}, medical=${medical}, spoof=${spoof}, racy=${racy}`,
      );

      return this.isLikelihoodSafe(adult) && this.isLikelihoodSafe(violence);
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }

      this.logger.error(
        'Error during Google Vision API call',
        error instanceof Error ? error.stack : error,
      );

      throw new UnprocessableEntityException(
        'Detection service unavailable or failed',
      );
    }
  }

  /**
   * Helper to determine if a likelihood level is considered safe.
   */
  private isLikelihoodSafe(likelihood: GoogleLikelihood): boolean {
    return (
      likelihood === GoogleLikelihood.VERY_UNLIKELY ||
      likelihood === GoogleLikelihood.UNLIKELY
    );
  }
}
