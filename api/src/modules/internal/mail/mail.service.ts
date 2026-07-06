import { ResendMailService } from '@/integrations/notifications/resend/services/mail.service';
import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';

@Injectable()
export class MailService {

  constructor(
    private readonly mail_service: ResendMailService
  ) { }

  create(create_mail_dto: CreateMailDto) {
    return this.mail_service.sendEmail(create_mail_dto);
  }
}
