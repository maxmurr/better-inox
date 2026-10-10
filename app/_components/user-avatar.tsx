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

// `usernameFromEmail` pads short email names as `user<name>` (plus a collision
// suffix); initials come from the email name, not the padding.
const PADDED_USERNAME = /^user([a-z0-9_-]{1,2}?)\d*$/;

export function initials(name: string): string {
  const padded = PADDED_USERNAME.exec(name)?.[1];
  if (padded) {
    return padded.toUpperCase();
  }
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
