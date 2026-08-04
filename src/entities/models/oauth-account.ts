import { z } from 'zod';

export const oauthAccountSchema = z.object({
  providerId: z.string(),
  providerUserId: z.string(),
  userId: z.string(),
});

export type OAuthAccount = z.infer<typeof oauthAccountSchema>;

export const googleIdentitySchema = z.object({
  providerUserId: z.string().min(1),
  email: z.email(),
  name: z.string().optional(),
  hd: z.string().optional(),
  avatarUrl: z.url().optional(),
});

export type GoogleIdentity = z.infer<typeof googleIdentitySchema>;
