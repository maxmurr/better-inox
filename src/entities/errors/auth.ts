export class UnauthenticatedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class OAuthStateMismatchError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class OAuthProviderError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class OAuthDomainNotAllowedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfterSeconds: number,
    options?: ErrorOptions
  ) {
    super(message, options);
  }
}
