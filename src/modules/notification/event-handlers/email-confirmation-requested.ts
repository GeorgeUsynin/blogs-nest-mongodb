import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailConfirmationRequestedEvent } from '../../user-accounts/users/application/events';
import { EmailManager } from '../email.manager';

@EventsHandler(EmailConfirmationRequestedEvent)
export class EmailConfirmationRequestedHandler implements IEventHandler<EmailConfirmationRequestedEvent> {
  constructor(private emailManager: EmailManager) {}

  handle(event: EmailConfirmationRequestedEvent) {
    this.emailManager.sendConfirmationEmail(event.email, event.code);
  }
}
