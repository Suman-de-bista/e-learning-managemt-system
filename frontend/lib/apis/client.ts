import { BASE_URL } from "@/lib/constants";

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.detail ?? "Something went wrong";
  } catch {
    return "Something went wrong";
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auths/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * fetch wrapper that retries once via /auths/refresh on a 401, so callers
 * don't need to handle access-token expiry themselves.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const isRefreshCall = path === "/auths/refresh";
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...init,
  });

  if (res.status !== 401 || isRefreshCall) {
    return res;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    return res;
  }

  return fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...init,
  });
}

export async function apiFetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, init);
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function apiFetchBlob(path: string, init: RequestInit = {}): Promise<Blob> {
  const res = await apiFetch(path, init);
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.blob();
}
