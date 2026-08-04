'use client';

import { useEffect, useRef, useState } from 'react';

import { signIn } from '../actions';
import { AuthField } from '../auth-field';
import { FormAlert } from '../form-alert';
import { SubmitButton } from '../submit-button';

export function SignInForm() {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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
    setPending(true);

    const res = await signIn(formData);
    if (res && res.error) {
      setError(res.error);
      setPending(false);
      passwordRef.current?.focus();
      passwordRef.current?.select();
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
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        minLength={3}
        maxLength={31}
        required
      />
      <AuthField
        ref={passwordRef}
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        minLength={6}
        maxLength={31}
        revealable
        required
      />
      <SubmitButton pending={pending} pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
