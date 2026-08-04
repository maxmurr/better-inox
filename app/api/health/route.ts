// Railway healthcheck target. Lives under /api so `proxy.ts` skips it and the
// probe is never redirected to the sign-in page.
export function GET() {
  return Response.json({ status: 'ok' });
}
