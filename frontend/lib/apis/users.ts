import { apiFetchJson } from "@/lib/apis/client";
import { EditUserFormType, RegisterFormType } from "../types/auths";
import { User } from "../types/common";

export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export async function fetchUsers(
  search: string | null = null,
  page: number = 1,
  limit: number = 10,
  sortBy: string | null = null,
  sortOrder: "asc" | "desc" = "asc"
): Promise<PaginatedUsers> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.set('search', search);
  }
  if (sortBy) {
    params.set('sort_by', sortBy);
    params.set('sort_order', sortOrder);
  }
  return apiFetchJson<PaginatedUsers>(`/users?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function fetchUserById(user_id: number): Promise<User> {
  return apiFetchJson<User>(`/users/${user_id}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function addUser(data: RegisterFormType): Promise<User> {
  return apiFetchJson<User>(`/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: number, data: Partial<EditUserFormType>): Promise<User> {
  return apiFetchJson<User>(`/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}


export async function deleteUser(id: number,): Promise<void> {
  return apiFetchJson<void>(`/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
