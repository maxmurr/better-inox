import { describe, expect, it } from 'vitest';

import { clientIpFrom } from '@/app/client-ip';

function headersWith(forwardedFor?: string) {
  return new Headers(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {});
}

describe('clientIpFrom', () => {
  it('reads the address appended by the trusted proxy', () => {
    expect(clientIpFrom(headersWith('203.0.113.7'))).toBe('203.0.113.7');
  });

  it('ignores entries the client sent itself', () => {
    expect(clientIpFrom(headersWith('1.1.1.1, 2.2.2.2, 203.0.113.7'))).toBe(
      '203.0.113.7'
    );
  });

  it('tolerates whitespace and empty entries', () => {
    expect(clientIpFrom(headersWith('  1.1.1.1 ,  , 203.0.113.7  '))).toBe(
      '203.0.113.7'
    );
  });

  it('returns undefined when the header is missing or empty', () => {
    expect(clientIpFrom(headersWith())).toBeUndefined();
    expect(clientIpFrom(headersWith('   '))).toBeUndefined();
    expect(clientIpFrom(headersWith(',,'))).toBeUndefined();
  });

  it('drops private addresses rather than bucketing everyone together', () => {
    expect(clientIpFrom(headersWith('203.0.113.7, 10.1.2.3'))).toBeUndefined();
    expect(
      clientIpFrom(headersWith('203.0.113.7, 172.16.0.1'))
    ).toBeUndefined();
    expect(
      clientIpFrom(headersWith('203.0.113.7, 192.168.1.1'))
    ).toBeUndefined();
    expect(clientIpFrom(headersWith('203.0.113.7, 127.0.0.1'))).toBeUndefined();
    expect(
      clientIpFrom(headersWith('203.0.113.7, 169.254.1.1'))
    ).toBeUndefined();
    expect(clientIpFrom(headersWith('203.0.113.7, fd12::1'))).toBeUndefined();
    expect(clientIpFrom(headersWith('203.0.113.7, fe80::1'))).toBeUndefined();
    expect(clientIpFrom(headersWith('203.0.113.7, ::1'))).toBeUndefined();
  });

  it('keeps public addresses in both families', () => {
    expect(clientIpFrom(headersWith('172.32.0.1'))).toBe('172.32.0.1');
    expect(clientIpFrom(headersWith('172.15.0.1'))).toBe('172.15.0.1');
    expect(clientIpFrom(headersWith('2001:db8::1'))).toBe('2001:db8::1');
  });
});
