import { TRUSTED_PROXY_HOPS } from '@/config';

export function clientIpFrom(requestHeaders: Headers): string | undefined {
  const forwardedFor = requestHeaders.get('x-forwarded-for');

  if (!forwardedFor) {
    return undefined;
  }

  const hops = forwardedFor
    .split(',')
    .map((hop) => hop.trim())
    .filter(Boolean);

  if (hops.length === 0) {
    return undefined;
  }

  const candidate = hops[Math.max(0, hops.length - TRUSTED_PROXY_HOPS)];

  return isPrivateAddress(candidate) ? undefined : candidate;
}

function isPrivateAddress(address: string): boolean {
  const ipv4 = address.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}$/);

  if (ipv4) {
    const [first, second] = [Number(ipv4[1]), Number(ipv4[2])];

    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168)
    );
  }

  const ipv6 = address.toLowerCase().replace(/^\[|\]$/g, '');

  return (
    ipv6 === '::' ||
    ipv6 === '::1' ||
    /^f[cd][0-9a-f]{2}:/.test(ipv6) ||
    /^fe[89ab][0-9a-f]:/.test(ipv6)
  );
}
