import { BASE_URL } from "../constants";
import { Course, CourseResponse } from "../types/common";
import { AddCourseType, EditCourseType } from "../types/courses";

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.detail ?? "Something went wrong";
  } catch {
    return "Something went wrong";
  }
}

export interface PaginatedCourses {
  items: CourseResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export async function fetchCoursesByInstructorId(instructor_id: string,page: number = 1, limit: number = 10): Promise<PaginatedCourses> {
  const res = await fetch(`${BASE_URL}/courses/${instructor_id}?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function fetchCourseById(course_id: number): Promise<Course> {
  const res = await fetch(`${BASE_URL}/courses/course/${course_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function addCourse(data: AddCourseType): Promise<Course> {
  const res = await fetch(`${BASE_URL}/courses/`, {
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

export async function updateCourse(id: number, data: Partial<EditCourseType>): Promise<Course> {
  const res = await fetch(`${BASE_URL}/courses/${id}`, {
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

export async function deleteCourse(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/courses/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}
