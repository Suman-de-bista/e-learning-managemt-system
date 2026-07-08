import { BASE_URL } from "../constants";
import { Instructor, User } from "../types/common";
import { AddInstructorType, EditInstructorType } from "../types/instructors";

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.detail ?? "Something went wrong";
  } catch {
    return "Something went wrong";
  }
}

export interface PaginatedInstructors {
  items: Instructor[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export async function fetchInstructors(page: number = 1, limit: number = 10): Promise<PaginatedInstructors> {
  const res = await fetch(`${BASE_URL}/instructors?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function fetchInstructorById(instructor_id:number): Promise<Instructor> {
  const res = await fetch(`${BASE_URL}/instructors/${instructor_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function addInstructor(data: AddInstructorType): Promise<User> {
  const res = await fetch(`${BASE_URL}/instructors/`, {
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
export async function updateInstructor(id: number, data: Partial<EditInstructorType>): Promise<User> {
  const res = await fetch(`${BASE_URL}/instructors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}


export async function deleteInstructor(id: number,): Promise<void> {
  const res = await fetch(`${BASE_URL}/instructors/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async  function exportInstructorCSV(){
  const res = await fetch(`${BASE_URL}/instructors/export/csv`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.blob();
}