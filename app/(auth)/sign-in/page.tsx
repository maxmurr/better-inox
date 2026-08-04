import type { Metadata } from 'next';

import { AuthCard, AuthLink } from '../auth-card';
import { GoogleSignIn } from '../google-sign-in';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account.',
};

export default function SignInPage() {
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
