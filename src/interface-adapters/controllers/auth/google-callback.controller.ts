import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ISignInWithGoogleUseCase } from '@/src/application/use-cases/auth/sign-in-with-google.use-case';

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
    signInWithGoogleUseCase: ISignInWithGoogleUseCase
  ) =>
  async (input: Partial<z.infer<typeof inputSchema>>): Promise<Cookie> => {
    return await instrumentationService.startSpan(
      { name: 'googleCallback Controller' },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const { cookie } = await signInWithGoogleUseCase(data);
        return cookie;
      }
    );
  };
