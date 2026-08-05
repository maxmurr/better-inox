import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRateLimiterService } from '@/src/application/services/rate-limiter.service.interface';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';

import { SIGN_UP_IP_RATE_LIMIT } from '@/config';

const inputSchema = z
  .object({
    username: z.string().min(3).max(31),
    password: z.string().min(6).max(31),
    confirm_password: z.string().min(6).max(31),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['password'],
      });
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

export type ISignUpController = ReturnType<typeof signUpController>;

export const signUpController =
  (
    instrumentationService: IInstrumentationService,
    rateLimiterService: IRateLimiterService,
    signUpUseCase: ISignUpUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    clientIp?: string
  ): Promise<ReturnType<typeof signUpUseCase>> => {
    return await instrumentationService.startSpan(
      { name: 'signUp Controller' },
      async () => {
        if (clientIp) {
          await rateLimiterService.check(SIGN_UP_IP_RATE_LIMIT, clientIp);
          await rateLimiterService.consume(SIGN_UP_IP_RATE_LIMIT, clientIp);
        }

        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        return await signUpUseCase(data);
      }
    );
  };
