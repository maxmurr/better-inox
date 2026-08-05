import {
  AuthenticationError,
  OAuthDomainNotAllowedError,
  OAuthProviderError,
  OAuthStateMismatchError,
  UnauthenticatedError,
  UnauthorizedError,
} from '@/src/entities/errors/auth';
import {
  DatabaseOperationError,
  InputParseError,
  NotFoundError,
} from '@/src/entities/errors/common';

const stubErrors = {
  AuthenticationError,
  UnauthenticatedError,
  UnauthorizedError,
  OAuthStateMismatchError,
  OAuthProviderError,
  OAuthDomainNotAllowedError,
  DatabaseOperationError,
  NotFoundError,
  InputParseError,
};

export type StubErrorName = keyof typeof stubErrors;

export function buildStubError(name: string, message: string): Error {
  const StubError = stubErrors[name as StubErrorName];

  if (!StubError) {
    throw new Error(`Unknown stub error "${name}"`);
  }

  return new StubError(message);
}
