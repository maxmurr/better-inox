'use client';

import Image from 'next/image';

import { signOut } from '@/app/(auth)/actions';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const AVATAR_RENDER_SIZE = 64;

export function UserMenu({
  username,
  avatarUrl,
}: {
  username: string;
  avatarUrl: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Avatar className="shrink-0 cursor-pointer transition-shadow outline-none before:absolute before:-inset-1.5 before:rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:ring-3 data-popup-open:ring-ring/30" />
        }
        nativeButton={false}
        aria-label={`Account menu for ${username}`}
      >
        {avatarUrl && (
          <AvatarImage
            src={avatarUrl}
            render={
              <Image
                src={avatarUrl}
                alt=""
                width={AVATAR_RENDER_SIZE}
                height={AVATAR_RENDER_SIZE}
                unoptimized
              />
            }
          />
        )}
        <AvatarFallback>{initials(username)}</AvatarFallback>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{username}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function initials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}
