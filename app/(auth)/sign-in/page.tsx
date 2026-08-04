import type { Metadata } from 'next';

import { AuthCard, AuthLink } from '../auth-card';
import { GoogleSignIn } from '../google-sign-in';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your account.',
};

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign in"
      description="Enter your username and password to continue."
      footer={
        <>
          <span>Don’t have an account?</span>
          <AuthLink href="/sign-up">Sign up</AuthLink>
        </>
      }
    >
      <SignInForm />
      <GoogleSignIn />
    </AuthCard>
  );
}
