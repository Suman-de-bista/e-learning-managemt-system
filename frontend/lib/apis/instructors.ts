import { apiFetchBlob, apiFetchJson } from "@/lib/apis/client";
import { Instructor, InstructorResponse, User } from "../types/common";
import { AddInstructorType, EditInstructorType } from "../types/instructors";

export interface PaginatedInstructors {
  items: InstructorResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export async function fetchInstructors(search: string | null = null, page: number = 1, limit: number = 10, sortBy: string | null = null,
  sortOrder: "asc" | "desc" = "asc"): Promise<PaginatedInstructors> {
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
  return apiFetchJson<PaginatedInstructors>(`/instructors/?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function fetchInstructorById(instructor_id: number): Promise<Instructor> {
  return apiFetchJson<Instructor>(`/instructors/${instructor_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function addInstructor(data: AddInstructorType): Promise<User> {
  return apiFetchJson<User>(`/instructors/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
export async function updateInstructor(id: number, data: Partial<EditInstructorType>): Promise<User> {
  return apiFetchJson<User>(`/instructors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}


export async function deleteInstructor(id: number,): Promise<void> {
  return apiFetchJson<void>(`/instructors/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

export async function exportInstructorCSV() {
  return apiFetchBlob(`/instructors/export/csv`, {
    method: "GET",
  });
}

export async function importInstructorCSV(file: File | null) {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);

  return apiFetchJson(`/instructors/import/csv`, {
    method: "POST",
    body: formData,
  });
}
