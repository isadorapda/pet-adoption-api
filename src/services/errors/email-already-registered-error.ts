export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('Email already registered.');
  }
}
