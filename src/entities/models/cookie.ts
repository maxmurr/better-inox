import { z } from 'zod';

/** Browser cookie attributes accepted by application services. */
export const cookieAttributesSchema = z.object({
  secure: z.boolean().optional(),
  path: z.string().optional(),
  domain: z.string().optional(),
  sameSite: z.enum(['lax', 'strict', 'none']).optional(),
  httpOnly: z.boolean().optional(),
  maxAge: z.number().optional(),
  expires: z.coerce.date().optional(),
});

/** Browser cookie transferred across application boundaries. */
export const cookieSchema = z.object({
  name: z.string(),
  value: z.string(),
  attributes: cookieAttributesSchema,
});

/** Parsed browser cookie owned by authentication services. */
export type Cookie = z.infer<typeof cookieSchema>;
