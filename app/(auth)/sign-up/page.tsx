import type { Metadata } from 'next';

import { AuthCard, AuthLink } from '../auth-card';
import { GoogleSignIn } from '../google-sign-in';
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create an account.',
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Sign up"
      description="Choose a username and password to get started."
      footer={
        <>
          <span>Already have an account?</span>
          <AuthLink href="/sign-in">Sign in</AuthLink>
        </>
      }
    >
      <SignUpForm />
      <GoogleSignIn />
    </AuthCard>
  );
}
