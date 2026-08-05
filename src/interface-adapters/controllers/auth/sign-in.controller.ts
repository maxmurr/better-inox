import { z } from 'zod';

import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRateLimiterService } from '@/src/application/services/rate-limiter.service.interface';
import { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';

import { SIGN_IN_IP_RATE_LIMIT, SIGN_IN_USER_RATE_LIMIT } from '@/config';

const inputSchema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(31),
});

export type ISignInController = ReturnType<typeof signInController>;

export const signInController =
  (
    instrumentationService: IInstrumentationService,
    rateLimiterService: IRateLimiterService,
    signInUseCase: ISignInUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    clientIp?: string
  ): Promise<Cookie> => {
    return await instrumentationService.startSpan(
      { name: 'signIn Controller' },
      async () => {
        if (clientIp) {
          await rateLimiterService.check(SIGN_IN_IP_RATE_LIMIT, clientIp);
        }

        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const usernameKey = data.username.toLowerCase();
        await rateLimiterService.check(SIGN_IN_USER_RATE_LIMIT, usernameKey);

        try {
          const { cookie } = await signInUseCase(data);
          await rateLimiterService.reset(SIGN_IN_USER_RATE_LIMIT, usernameKey);
          return cookie;
        } catch (err) {
          if (err instanceof AuthenticationError) {
            await rateLimiterService.consume(
              SIGN_IN_USER_RATE_LIMIT,
              usernameKey
            );
            if (clientIp) {
              await rateLimiterService.consume(SIGN_IN_IP_RATE_LIMIT, clientIp);
            }
          }
          throw err;
        }
      }
    );
  };
