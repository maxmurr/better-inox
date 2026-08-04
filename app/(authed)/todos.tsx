'use client';

import { useCallback, useState } from 'react';

import { Loader, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../_components/ui/button';
import { Checkbox } from '../_components/ui/checkbox';
import { cn } from '../_components/utils';
import { bulkUpdate, toggleTodo } from './actions';

type Todo = { id: number; todo: string; userId: string; completed: boolean };

function toggled(ids: ReadonlySet<number>, id: number) {
  const next = new Set(ids);

  if (!next.delete(id)) {
    next.add(id);
  }

  return next;
}

export function Todos({ todos }: { todos: Todo[] }) {
  const [bulkMode, setBulkMode] = useState(false);
  const [dirty, setDirty] = useState<ReadonlySet<number>>(new Set());
  const [deleted, setDeleted] = useState<ReadonlySet<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const handleToggle = useCallback(
    async (id: number) => {
      if (bulkMode) {
        setDirty((current) => toggled(current, id));
        return;
      }

      const res = await toggleTodo(id);
      if (res) {
        if (res.error) {
          toast.error(res.error);
        } else if (res.success) {
          toast.success('Todo toggled!');
        }
      }
    },
    [bulkMode]
  );

  const markForDeletion = useCallback((id: number) => {
    setDirty((current) => {
      if (!current.has(id)) {
        return current;
      }

      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setDeleted((current) => toggled(current, id));
  }, []);

  const updateAll = async () => {
    setLoading(true);
    const res = await bulkUpdate([...dirty], [...deleted]);
    setLoading(false);
    setBulkMode(false);
    setDirty(new Set());
    setDeleted(new Set());
    if (res) {
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success('Bulk update completed!');
      }
    }
  };

  return (
    <>
      {todos.length > 0 ? (
        <ul className="w-full">
          {todos.map((todo) => {
            const isDeleted = deleted.has(todo.id);
            const isCompleted = dirty.has(todo.id)
              ? !todo.completed
              : todo.completed;

            return (
              <li
                key={todo.id}
                className="flex min-h-10 w-full items-center gap-2 rounded-sm p-1 [contain-intrinsic-size:auto_2.5rem] [content-visibility:auto] hover:bg-muted/50 active:bg-muted pointer-coarse:min-h-11"
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => handleToggle(todo.id)}
                  id={`checkbox-${todo.id}`}
                  disabled={isDeleted || loading}
                />
                <label
                  htmlFor={`checkbox-${todo.id}`}
                  className={cn('min-w-0 flex-1 wrap-break-word', {
                    'cursor-pointer': !isDeleted && !loading,
                    'text-muted-foreground line-through': isCompleted,
                    'text-destructive line-through': isDeleted,
                  })}
                >
                  {todo.todo}
                </label>
                {bulkMode && (
                  <Button
                    size="icon-sm"
                    variant="destructive"
                    disabled={loading}
                    aria-label={
                      isDeleted
                        ? `Keep “${todo.todo}”`
                        : `Delete “${todo.todo}”`
                    }
                    aria-pressed={isDeleted}
                    onClick={() => markForDeletion(todo.id)}
                  >
                    <Trash aria-hidden />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No todos yet. Add one above to get started.
        </p>
      )}
      {bulkMode ? (
        <div className="grid w-full grid-cols-2 gap-2">
          <Button disabled={loading} aria-busy={loading} onClick={updateAll}>
            {loading ? (
              <>
                <Loader
                  aria-hidden
                  className="animate-spin motion-reduce:animate-none"
                />
                Updating…
              </>
            ) : (
              'Update All'
            )}
          </Button>
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => {
              setBulkMode(false);
              setDirty(new Set());
              setDeleted(new Set());
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={() => setBulkMode(true)}>Bulk Operations</Button>
      )}
    </>
  );
}
