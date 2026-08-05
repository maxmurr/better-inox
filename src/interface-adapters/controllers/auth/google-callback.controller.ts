import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRateLimiterService } from '@/src/application/services/rate-limiter.service.interface';
import { ISignInWithGoogleUseCase } from '@/src/application/use-cases/auth/sign-in-with-google.use-case';

import { OAUTH_CALLBACK_IP_RATE_LIMIT } from '@/config';

const inputSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
  storedState: z.string().min(1),
  codeVerifier: z.string().min(1),
});

export type IGoogleCallbackController = ReturnType<
  typeof googleCallbackController
>;

export const googleCallbackController =
  (
    instrumentationService: IInstrumentationService,
    rateLimiterService: IRateLimiterService,
    signInWithGoogleUseCase: ISignInWithGoogleUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    clientIp?: string
  ): Promise<Cookie> => {
    return await instrumentationService.startSpan(
      { name: 'googleCallback Controller' },
      async () => {
        if (clientIp) {
          await rateLimiterService.check(
            OAUTH_CALLBACK_IP_RATE_LIMIT,
            clientIp
          );
          await rateLimiterService.consume(
            OAUTH_CALLBACK_IP_RATE_LIMIT,
            clientIp
          );
        }

        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const { cookie } = await signInWithGoogleUseCase(data);
        return cookie;
      }
    );
  };
