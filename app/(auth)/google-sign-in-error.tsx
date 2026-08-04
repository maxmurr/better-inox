'use client';

import { useSearchParams } from 'next/navigation';

import { ALLOWED_GOOGLE_HD } from '@/config';

import { FormAlert } from './form-alert';

export function GoogleSignInError() {
  const error = useSearchParams().get('error');

  if (error === 'google_domain') {
    return (
      <FormAlert>
        That Google account is not allowed. Sign in with your{' '}
        {ALLOWED_GOOGLE_HD.join(' or ')} account.
      </FormAlert>
    );
  }

  if (error === 'google') {
    return (
      <FormAlert>Could not sign in with Google. Please try again.</FormAlert>
    );
  }

  return null;
}
