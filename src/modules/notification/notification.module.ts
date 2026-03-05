import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailAdapter } from './email.adapter';
import { EmailManager } from './email.manager';
import { EMAIL_SERVICE } from './constants';
import {
  EmailConfirmationRequestedHandler,
  PasswordRecoveryRequestedHandler,
} from './event-handlers';

@Module({
  imports: [
    // Using forRootAsync for proper environment variables loading
    MailerModule.forRootAsync({
      // useFactory: async (coreConfig: CoreConfig) => ({
      useFactory: async () => ({
        transport: {
          service: EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_BLOG_PLATFORM,
            pass: process.env.EMAIL_BLOG_PLATFORM_PASSWORD,
          },
        },
        defaults: {
          from: `Blog Platform <${process.env.EMAIL_BLOG_PLATFORM}>`,
        },
      }),
      // inject: [CoreConfig],
    }),
  ],
  providers: [
    EmailAdapter,
    EmailManager,
    EmailConfirmationRequestedHandler,
    PasswordRecoveryRequestedHandler,
  ],
  exports: [EmailManager],
})
export class NotificationsModule {}
