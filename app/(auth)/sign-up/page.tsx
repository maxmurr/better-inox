import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { POST_SIGN_IN_REDIRECT } from '@/config';

import { AuthCard, AuthLink } from '../auth-card';
import { GoogleSignIn } from '../google-sign-in';
import { hasValidSession } from '../session';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create an account.',
};

export default async function SignUpPage() {
  if (await hasValidSession()) {
    redirect(POST_SIGN_IN_REDIRECT);
  }

  return (
    <AuthCard
      title="Sign Up"
      description="Create an account with your Inox Google account."
      footer={
        <>
          <span>Already have an account?</span>
          <AuthLink href="/sign-in">Sign In</AuthLink>
        </>
      }
    >
      <GoogleSignIn />
    </AuthCard>
  );
}
