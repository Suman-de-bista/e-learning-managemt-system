import { apiFetch, apiFetchJson } from "@/lib/apis/client";
import { LoginFormType, RegisterFormType } from "@/lib/types/auths";
import { User } from "@/lib/types/common";

export async function loginUser(data: LoginFormType): Promise<User> {
  return apiFetchJson<User>("/auths/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function registerUser(data: RegisterFormType): Promise<User> {
  return apiFetchJson<User>("/auths/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const res = await apiFetch("/auths/me");
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function logoutUser(): Promise<void> {
  await apiFetch("/auths/logout", { method: "POST" });
}
