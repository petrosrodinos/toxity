import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { EmailConfig } from '@/shared/constants/email';
import { CreateEmail } from '../../interfaces/mail.interfaces';
import { ResendConfig } from './resend.config';

@Injectable()
export class ResendAdapter {
  private readonly logger = new Logger(ResendAdapter.name);

  constructor(private readonly resendConfig: ResendConfig) {}

  public async sendEmail(create_email: CreateEmail) {
    try {
      const resend_client = this.resendConfig.getResendClient();
      return await resend_client.emails.send({
        from: create_email.from || `Toxity <${EmailConfig.email_addresses.alert}>`,
        to: create_email.to,
        subject: create_email.subject,
        text: create_email.text,
        html: create_email.html,
        cc: create_email.cc,
        bcc: create_email.bcc,
        replyTo: create_email.replyTo,
        headers: create_email.headers,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to send email with Resend');
    }
  }
}
