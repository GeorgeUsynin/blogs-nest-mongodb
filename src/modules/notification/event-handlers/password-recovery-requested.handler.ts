import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PasswordRecoveryRequestedEvent } from '../../user-accounts/users/application/events';
import { EmailManager } from '../email.manager';

@EventsHandler(PasswordRecoveryRequestedEvent)
export class PasswordRecoveryRequestedHandler implements IEventHandler<PasswordRecoveryRequestedEvent> {
  constructor(private emailManager: EmailManager) {}

  handle(event: PasswordRecoveryRequestedEvent) {
    this.emailManager.sendPasswordRecoveryEmail(event.email, event.code);
  }
}
