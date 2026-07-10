// Browser requests go through the Next.js same-origin rewrite (see next.config.ts)
// so that auth cookies set by the backend are first-party, not third-party.
// Server-side code (e.g. proxy.ts) should call NEXT_PUBLIC_API_URL directly instead.
export const BASE_URL = "/api/backend";
