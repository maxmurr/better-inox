import type { Metadata } from 'next';

import { AuthCard, AuthLink } from '../auth-card';
import { GoogleSignIn } from '../google-sign-in';
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create an account.',
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Sign Up"
      description="Choose a username and password to get started."
      footer={
        <>
          <span>Already have an account?</span>
          <AuthLink href="/sign-in">Sign In</AuthLink>
        </>
      }
    >
      <SignUpForm />
      <GoogleSignIn />
    </AuthCard>
  );
}
