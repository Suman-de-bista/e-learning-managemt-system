import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseResponse } from "@/lib/types/common";
import { TableRowMenu } from "./TableRowMenu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type CourseSortKey = "title" | "level" | "created_at";
export type SortDirection = "asc" | "desc";

interface CoursesTableProps {
  courses: CourseResponse[] | null;
  onEditClick: (id: number) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  sortKey?: CourseSortKey | null;
  sortDirection?: SortDirection;
  onSortChange?: (key: CourseSortKey) => void;
}

export function CourseTable({
  courses,
  onEditClick,
  onAdd,
  onDelete,
  sortKey,
  sortDirection,
  onSortChange,
}: CoursesTableProps) {
  const router = useRouter();

  const renderSortIcon = (key: CourseSortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-1 inline size-3.5" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 inline size-3.5" />
    ) : (
      <ArrowDown className="ml-1 inline size-3.5" />
    );
  };

  return (
    <Table>
      <TableHeader className="bg-gray-100 w-full">
        <TableRow>
          <TableHead key="sn">S.N</TableHead>
          <TableHead key="instructor_id">Instructor Name</TableHead>
          <TableHead
            key="title"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("title")}
          >
            Title{renderSortIcon("title")}
          </TableHead>
          <TableHead
            key="level"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("level")}
          >
            Level{renderSortIcon("level")}
          </TableHead>
          <TableHead key="duration_hours">Duration Hours</TableHead>
          <TableHead
            key="created_at"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("created_at")}
          >
            Created At{renderSortIcon("created_at")}
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="cursor-pointer hover:bg-gray-200" onClick={onAdd}>
          <TableCell colSpan={7} className="font-medium text-center">
            + Add New Course
          </TableCell>
        </TableRow>
        {courses?.map((course, index) => (
          <TableRow key={index}>
            <TableCell key="sn">{index + 1}</TableCell>
            <TableCell key="instructor_id">{course["instructor_name"]}</TableCell>
            <TableCell key="title">{course["title"]}</TableCell>
            <TableCell key="level">{course["level"]}</TableCell>
            <TableCell key="duration_hours">{course["duration_hours"]}</TableCell>
            <TableCell key="created_at">
              {new Date(course["created_at"]).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              <TableRowMenu id={course.id} onEdit={onEditClick} onDelete={onDelete} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
