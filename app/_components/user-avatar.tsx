'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function UserAvatar({
  username,
  avatarUrl,
  size = 'default',
}: {
  username: string;
  avatarUrl: string | null;
  size?: 'default' | 'sm' | 'lg';
}) {
  return (
    <Avatar size={size}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt="" referrerPolicy="no-referrer" />
      ) : null}
      <AvatarFallback>{initials(username)}</AvatarFallback>
    </Avatar>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
