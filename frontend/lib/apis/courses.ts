import { apiFetchJson } from "@/lib/apis/client";
import { Course, CourseResponse } from "../types/common";
import { AddCourseType, EditCourseType } from "../types/courses";

export interface PaginatedCourses {
  items: CourseResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export async function fetchCoursesByInstructorId(instructor_id: string,page: number = 1, limit: number = 10, search: string | null = null, sortBy: string | null = null, sortOrder: "asc" | "desc" = "asc"): Promise<PaginatedCourses> {
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
  return apiFetchJson<PaginatedCourses>(`/courses/${instructor_id}?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function fetchCourseById(course_id: number): Promise<Course> {
  return apiFetchJson<Course>(`/courses/course/${course_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function addCourse(data: AddCourseType): Promise<Course> {
  return apiFetchJson<Course>(`/courses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCourse(id: number, data: Partial<EditCourseType>): Promise<Course> {
  return apiFetchJson<Course>(`/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCourse(id: number): Promise<void> {
  return apiFetchJson<void>(`/courses/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
