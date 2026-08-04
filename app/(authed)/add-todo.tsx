'use client';

import { useRef, useState } from 'react';

import { Loader, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { FormAlert } from '../_components/form-alert';
import { Button } from '../_components/ui/button';
import { Input } from '../_components/ui/input';
import { Label } from '../_components/ui/label';
import { createTodo } from './actions';

export function CreateTodo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);

    setError(undefined);
    setLoading(true);
    const res = await createTodo(formData);
    setLoading(false);

    if (res && 'error' in res && res.error) {
      setError(res.error);
      inputRef.current?.focus();
      inputRef.current?.select();
      return;
    }

    if (res && 'success' in res && res.success) {
      toast.success('Todo(s) created!');

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <Label htmlFor="todo" className="sr-only">
          New todo
        </Label>
        <Input
          ref={inputRef}
          id="todo"
          name="todo"
          className="flex-1"
          placeholder="Take out trash…"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'todo-error' : undefined}
          onChange={() => error && setError(undefined)}
        />
        <Button
          size="icon"
          type="submit"
          disabled={loading}
          aria-busy={loading}
          aria-label="Add todo"
        >
          {loading ? (
            <Loader
              aria-hidden
              className="animate-spin motion-reduce:animate-none"
            />
          ) : (
            <Plus aria-hidden />
          )}
        </Button>
      </div>
      {error ? (
        <FormAlert id="todo-error" className="text-xs">
          {error}
        </FormAlert>
      ) : null}
      <span role="status" className="sr-only">
        {loading ? 'Creating todo…' : ''}
      </span>
    </form>
  );
}
