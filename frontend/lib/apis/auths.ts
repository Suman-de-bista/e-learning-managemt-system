import { BASE_URL } from "@/lib/constants";
import { LoginFormType, RegisterFormType } from "@/lib/types/auths";
import { User } from "@/lib/types/common";

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.detail ?? "Something went wrong";
  } catch {
    return "Something went wrong";
  }
}

export async function loginUser(data: LoginFormType): Promise<User> {
  const res = await fetch(`${BASE_URL}/auths/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function registerUser(data: RegisterFormType): Promise<User> {
  const res = await fetch(`${BASE_URL}/auths/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/auths/me`, { credentials: "include" });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function logoutUser(): Promise<void> {
  await fetch(`${BASE_URL}/auths/logout`, {
    method: "POST",
    credentials: "include",
  });
}
