import { z } from 'zod';

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

/** Error names supported by test adapter stubs. */
export const stubErrorNameSchema = z.enum([
  'AuthenticationError',
  'UnauthenticatedError',
  'UnauthorizedError',
  'OAuthStateMismatchError',
  'OAuthProviderError',
  'OAuthDomainNotAllowedError',
  'DatabaseOperationError',
  'NotFoundError',
  'InputParseError',
]);

/** Error name supported by test adapter stubs. */
export type StubErrorName = z.infer<typeof stubErrorNameSchema>;

/** Serialized error envelope accepted by test adapters. */
export const stubErrorEnvelopeSchema = z.object({
  __stubError: z.object({
    name: stubErrorNameSchema,
    message: z.string(),
  }),
});

/** Serialized error envelope accepted by test adapters. */
export type StubErrorEnvelope = z.infer<typeof stubErrorEnvelopeSchema>;

type StubErrorConstructor = new (
  message: string,
  options?: ErrorOptions
) => Error;

const stubErrorConstructors = {
  AuthenticationError,
  UnauthenticatedError,
  UnauthorizedError,
  OAuthStateMismatchError,
  OAuthProviderError,
  OAuthDomainNotAllowedError,
  DatabaseOperationError,
  NotFoundError,
  InputParseError,
} satisfies Record<StubErrorName, StubErrorConstructor>;

export function buildStubError(name: StubErrorName, message: string): Error {
  const StubError = stubErrorConstructors[name];
  return new StubError(message);
}
