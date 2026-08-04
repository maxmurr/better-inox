'use client';

import { useEffect, useRef, useState } from 'react';

import { FormAlert } from '@/app/_components/form-alert';

import { signUp } from '../actions';
import { AuthField } from '../auth-field';
import { SubmitButton } from '../submit-button';

export function SignUpForm() {
  const [error, setError] = useState<string>();
  const [confirmError, setConfirmError] = useState<string>();
  const [pending, setPending] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      usernameRef.current?.focus();
    }
  }, []);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);

    setError(undefined);
    setConfirmError(undefined);

    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirm_password')?.toString();

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      confirmRef.current?.focus();
      confirmRef.current?.select();
      return;
    }

    setPending(true);

    const res = await signUp(formData);
    if (res && res.error) {
      setError(res.error);
      setPending(false);
      usernameRef.current?.focus();
      usernameRef.current?.select();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <FormAlert>{error}</FormAlert>}
      <AuthField
        ref={usernameRef}
        id="username"
        name="username"
        label="Username"
        type="text"
        hint="3–31 characters."
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        minLength={3}
        maxLength={31}
        required
      />
      <AuthField
        id="password"
        name="password"
        label="Password"
        type="password"
        hint="At least 6 characters."
        autoComplete="new-password"
        minLength={6}
        maxLength={31}
        revealable
        required
      />
      <AuthField
        ref={confirmRef}
        id="confirm-password"
        name="confirm_password"
        label="Confirm password"
        type="password"
        error={confirmError}
        onChange={() => confirmError && setConfirmError(undefined)}
        autoComplete="new-password"
        minLength={6}
        maxLength={31}
        revealable
        required
      />
      <SubmitButton pending={pending} pendingLabel="Creating your account…">
        Create Account
      </SubmitButton>
    </form>
  );
}
