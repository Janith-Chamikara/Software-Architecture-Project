import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  /**
   * Simulates sending an SMS to the traffic police officer.
   * In a production environment, this would call an external API (e.g., Twilio).
   */
  async sendPaymentConfirmationSms(
    officerPhone: string,
    fineReference: string,
  ): Promise<boolean> {
    try {
      // Mocking the external SMS Gateway call
      this.logger.log(`[SMS Gateway] Sending SMS to ${officerPhone}...`);
      this.logger.log(
        `[SMS Gateway] Message: "Fine ${fineReference} has been successfully paid. You may release the driver's license."`,
      );

      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${officerPhone}`, error);
      return false; // We return false instead of throwing so the payment doesn't roll back just because the SMS failed
    }
  }
}
