export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly createdAt: string,
  ) {}

  toString() {
    return JSON.stringify({
      userId: this.userId,
      createdAt: this.createdAt,
    });
  }
}
