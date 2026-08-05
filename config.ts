import { RateLimitPolicy } from '@/src/entities/models/rate-limit';

export const SESSION_COOKIE = 'auth_session';
export const PASSWORD_SALT_ROUNDS = 10;

export const GOOGLE_PROVIDER_ID = 'google';
export const GOOGLE_SCOPES = ['openid', 'profile', 'email'];
export const GOOGLE_STATE_COOKIE = 'google_oauth_state';
export const GOOGLE_CODE_VERIFIER_COOKIE = 'google_code_verifier';

export const OAUTH_COOKIE_MAX_AGE = 60 * 10;

export const ALLOWED_GOOGLE_HD = ['inox.co.th'];

export const POST_SIGN_IN_REDIRECT = '/c/four-pillars';

export const COURSE_PANEL_COOKIE = 'course_panel';
export const COURSE_PANEL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const TRUSTED_PROXY_HOPS = 1;

export const SIGN_IN_USER_RATE_LIMIT: RateLimitPolicy = {
  bucket: 'signin:user',
  limit: 5,
  windowSeconds: 15 * 60,
};

export const SIGN_IN_IP_RATE_LIMIT: RateLimitPolicy = {
  bucket: 'signin:ip',
  limit: 30,
  windowSeconds: 15 * 60,
};

export const SIGN_UP_IP_RATE_LIMIT: RateLimitPolicy = {
  bucket: 'signup:ip',
  limit: 5,
  windowSeconds: 60 * 60,
};

export const OAUTH_START_IP_RATE_LIMIT: RateLimitPolicy = {
  bucket: 'oauth:start:ip',
  limit: 30,
  windowSeconds: 15 * 60,
};

export const OAUTH_CALLBACK_IP_RATE_LIMIT: RateLimitPolicy = {
  bucket: 'oauth:callback:ip',
  limit: 30,
  windowSeconds: 15 * 60,
};
