import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(31),
  avatar_url: z.url().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const createOAuthUserSchema = userSchema
  .pick({
    id: true,
    username: true,
  })
  .extend({ avatar_url: z.url().nullish() });

export type CreateOAuthUser = z.infer<typeof createOAuthUserSchema>;

const USERNAME_CANDIDATE_MAX_LENGTH = 25;

export function usernameFromEmail(email: string): string {
  const sanitized = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, USERNAME_CANDIDATE_MAX_LENGTH);
  return sanitized.length >= 3 ? sanitized : `user${sanitized}`;
}
