// Browser requests go through the same-origin route handler at
// app/api/backend/[...path]/route.ts, which forwards to the real backend
// server-side, so auth cookies set by the backend are first-party, not
// third-party. Server-side code (e.g. proxy.ts) should call
// NEXT_PUBLIC_API_URL directly instead.
export const BASE_URL = "/api/backend";
