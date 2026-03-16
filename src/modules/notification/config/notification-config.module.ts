import { Module } from '@nestjs/common';
import { NotificationConfig } from './notification.config';

@Module({
  providers: [NotificationConfig],
  exports: [NotificationConfig],
})
export class NotificationConfigModule {}
