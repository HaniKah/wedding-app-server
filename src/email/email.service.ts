import { HttpService } from '@nestjs/axios';
import type { ConfigType } from '@nestjs/config';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import resendConfig from './config/resend.config';

const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Sends transactional email via Resend's HTTP API (no SMTP dependency).
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(resendConfig.KEY)
    private readonly config: ConfigType<typeof resendConfig>,
    private readonly httpService: HttpService,
  ) {}

  async sendOtpEmail(to: string, code: string): Promise<void> {
    if (!this.config.apiKey || !this.config.from) {
      throw new InternalServerErrorException(
        'Email service is not configured (RESEND_API_KEY / RESEND_FROM_EMAIL missing).',
      );
    }

    try {
      await firstValueFrom(
        this.httpService.post(
          RESEND_API_URL,
          {
            from: this.config.from,
            to,
            subject: 'Verify your email',
            html: this.buildOtpHtml(code),
          },
          {
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
    } catch (error) {
      this.logger.error(
        `Failed to send OTP email to ${to}`,
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException(
        'Could not send verification email. Please try again.',
      );
    }
  }

  private buildOtpHtml(code: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Use the code below to verify your email address:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${code}</p>
        <p>This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
      </div>
    `;
  }
}
