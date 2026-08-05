import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { POST_SIGN_IN_REDIRECT } from '@/config';

import { AuthCard, AuthLink } from '../auth-card';
import { GoogleSignIn } from '../google-sign-in';
import { hasValidSession } from '../session';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account.',
};

export default async function SignInPage() {
  if (await hasValidSession()) {
    redirect(POST_SIGN_IN_REDIRECT);
  }

  return (
    <AuthCard
      title="Sign In"
      description="Enter your username and password to continue."
      footer={
        <>
          <span>Don’t have an account?</span>
          <AuthLink href="/sign-up">Sign Up</AuthLink>
        </>
      }
    >
      <SignInForm />
      <GoogleSignIn />
    </AuthCard>
  );
}
