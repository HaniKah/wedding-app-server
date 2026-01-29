import { WebhookJwtAuthGuard } from './webhook-jwt-auth.guard';

describe('WebhookJwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new WebhookJwtAuthGuard()).toBeDefined();
  });
});
