export class EmailConfirmationRequestedEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
