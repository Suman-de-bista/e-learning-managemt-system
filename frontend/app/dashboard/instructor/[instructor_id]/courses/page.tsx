"use client";
import { AddCourseModal } from "@/components/custom/AddCourseModal";
import { CourseTable, CourseSortKey } from "@/components/custom/CourseTable";
import { EditCourseModal } from "@/components/custom/EditCourseModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { deleteCourse, fetchCourseById, fetchCoursesByInstructorId } from "@/lib/apis/courses";
import { Course, CourseResponse } from "@/lib/types/common";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/custom/SearchInput";
import { toast } from "sonner";

interface CoursesProps {
  params: Promise<{ instructor_id: number }>;
}

export default function Courses() {
  const params = useParams<{ instructor_id: string }>();
  const router = useRouter();

  const [courses, setCourses] = useState<CourseResponse[] | null>(null);

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [courseSearch, setCourseSearch] = useState<string | null>(null);
  const [courseSortKey, setCourseSortKey] = useState<CourseSortKey | null>(null);
  const [courseSortDirection, setCourseSortDirection] = useState<"asc" | "desc">("asc");
  const limit = 10;

  const loadCourses = (
    targetPage: number = page,
    search: string | null = courseSearch,
    sortBy: CourseSortKey | null = courseSortKey,
    sortOrder: "asc" | "desc" = courseSortDirection,
  ) => {
    fetchCoursesByInstructorId(
      params.instructor_id,
      targetPage,
      limit,
      search,
      sortBy,
      sortOrder,
    ).then((data) => {
      setCourses(data.items);
      setTotalPages(data.total_pages);
    });
  };

  const searchCoursesHandler = (query: string) => {
    setCourseSearch(query);
    setPage(1);
    loadCourses(1, query);
  };

  const handleCourseSortChange = (key: CourseSortKey) => {
    const nextDirection = courseSortKey === key && courseSortDirection === "asc" ? "desc" : "asc";
    setCourseSortKey(key);
    setCourseSortDirection(nextDirection);
    setPage(1);
    loadCourses(1, courseSearch, key, nextDirection);
  };

  useEffect(() => {
    loadCourses(page);
  }, []);
  return (
    <div className="flex flex-col gap-6 w-8/10 mx-auto mt-20">
      <Button className="w-1/8" variant="outline" onClick={() => router.push("/dashboard")}>
        {" "}
        Go to Dashboard
      </Button>
      <div className="flex w-full justify-end">
        <SearchInput onSearch={searchCoursesHandler} />
      </div>
      <CourseTable
        courses={courses}
        onAdd={() => setIsAddCourseModalOpen(true)}
        onEditClick={(id) => {
          setIsEditCourseModalOpen(true);
          fetchCourseById(id).then((course) => setEditCourse(course));
        }}
        onDelete={(id) => {
          deleteCourse(id).then(() => {
            toast.success("Course Deleted Successfully.");
            loadCourses();
          });
        }}
        sortKey={courseSortKey}
        sortDirection={courseSortDirection}
        onSortChange={handleCourseSortChange}
      />
      <Pagination className="py-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 text-sm">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page >= totalPages}
              className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.min(totalPages, p + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <AddCourseModal
        instructorId={Number(params.instructor_id)}
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onSuccess={() => {
          setIsAddCourseModalOpen(false);
          toast.success("Course Added Successfully.");
          loadCourses();
        }}
      />
      {editCourse && (
        <EditCourseModal
          course={editCourse}
          isOpen={isEditCourseModalOpen}
          onClose={() => {
            setIsEditCourseModalOpen(false);
            setEditCourse(null);
          }}
          onSuccess={() => {
            setIsEditCourseModalOpen(false);
            setEditCourse(null);
            toast.success("Course Updated Successfully.");
            loadCourses();
          }}
        />
      )}
    </div>
  );
}
