'use client';

import { useCallback, useState } from 'react';

import { Loader, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../_components/ui/button';
import { Checkbox } from '../_components/ui/checkbox';
import { cn } from '../_components/utils';
import { bulkUpdate, toggleTodo } from './actions';

type Todo = { id: number; todo: string; userId: string; completed: boolean };

export function Todos({ todos }: { todos: Todo[] }) {
  const [bulkMode, setBulkMode] = useState(false);
  const [dirty, setDirty] = useState<number[]>([]);
  const [deleted, setDeleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleToggle = useCallback(
    async (id: number) => {
      if (bulkMode) {
        const dirtyIndex = dirty.findIndex((t) => t === id);
        if (dirtyIndex > -1) {
          const newDirty = Object.assign([], dirty);
          newDirty.splice(dirtyIndex, 1);
          setDirty(newDirty);
        } else {
          setDirty([...dirty, id]);
        }
      } else {
        const res = await toggleTodo(id);
        if (res) {
          if (res.error) {
            toast.error(res.error);
          } else if (res.success) {
            toast.success('Todo toggled!');
          }
        }
      }
    },
    [bulkMode, dirty]
  );

  const markForDeletion = useCallback(
    (id: number) => {
      const dirtyIndex = dirty.findIndex((t) => t === id);
      if (dirtyIndex > -1) {
        const newDirty = Object.assign([], dirty);
        newDirty.splice(dirtyIndex, 1);
        setDirty(newDirty);
      }

      const deletedIndex = deleted.findIndex((t) => t === id);
      if (deletedIndex === -1) {
        setDeleted((d) => [...d, id]);
      } else {
        const newDeleted = Object.assign([], deleted);
        newDeleted.splice(deletedIndex, 1);
        setDeleted(newDeleted);
      }
    },
    [deleted, dirty]
  );

  const updateAll = async () => {
    setLoading(true);
    const res = await bulkUpdate(dirty, deleted);
    setLoading(false);
    setBulkMode(false);
    setDirty([]);
    setDeleted([]);
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
      <ul className="w-full">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex h-10 w-full items-center gap-2 rounded-sm p-1 hover:bg-muted/50 active:bg-muted"
            >
              <Checkbox
                checked={
                  dirty.findIndex((t) => t === todo.id) > -1
                    ? !todo.completed
                    : todo.completed
                }
                onCheckedChange={() => handleToggle(todo.id)}
                id={`checkbox-${todo.id}`}
                disabled={
                  deleted.findIndex((t) => t === todo.id) > -1 || loading
                }
              />
              <label
                htmlFor={`checkbox-${todo.id}`}
                className={cn('flex-1 cursor-pointer', {
                  'text-muted-foreground line-through':
                    dirty.findIndex((t) => t === todo.id) > -1
                      ? !todo.completed
                      : todo.completed,
                  'text-destructive line-through':
                    deleted.findIndex((t) => t === todo.id) > -1,
                })}
              >
                {todo.todo}
              </label>
              {bulkMode && (
                <Button
                  size="icon-sm"
                  variant="destructive"
                  disabled={loading}
                  onClick={() => markForDeletion(todo.id)}
                >
                  <Trash />
                </Button>
              )}
            </li>
          ))
        ) : (
          <p>No todos. Create some to get started!</p>
        )}
      </ul>
      {bulkMode ? (
        <div className="grid w-full grid-cols-2 gap-2">
          <Button disabled={loading} onClick={updateAll}>
            {loading ? <Loader className="animate-spin" /> : 'Update all'}
          </Button>
          <Button variant="secondary" onClick={() => setBulkMode(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={() => setBulkMode(true)}>Bulk operations</Button>
      )}
    </>
  );
}
