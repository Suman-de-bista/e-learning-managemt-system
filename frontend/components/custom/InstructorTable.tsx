import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InstructorResponse } from "@/lib/types/common";
import { TableRowMenu } from "./TableRowMenu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type InstructorSortKey = "name" | "expertise" | "bio" | "created_at";
export type SortDirection = "asc" | "desc";

interface InstructorTableProps {
  instructors: InstructorResponse[] | null;
  onEditClick: (id: number) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  sortKey?: InstructorSortKey | null;
  sortDirection?: SortDirection;
  onSortChange?: (key: InstructorSortKey) => void;
}

export function InstructorTable({
  instructors,
  onAdd,
  onEditClick,
  onDelete,
  sortKey,
  sortDirection,
  onSortChange,
}: InstructorTableProps) {
  const router = useRouter();

  const renderSortIcon = (key: InstructorSortKey) => {
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
          <TableHead key="sn">S.N.</TableHead>
          <TableHead
            key="name"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("name")}
          >
            Name{renderSortIcon("name")}
          </TableHead>
          <TableHead
            key="expertise"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("expertise")}
          >
            Expertise{renderSortIcon("expertise")}
          </TableHead>
          <TableHead
            key="bio"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("bio")}
          >
            Bio{renderSortIcon("bio")}
          </TableHead>
          <TableHead
            key="created_at"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("created_at")}
          >
            Created At{renderSortIcon("created_at")}
          </TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="cursor-pointer hover:bg-gray-200" onClick={onAdd}>
          <TableCell colSpan={7} className="font-medium text-center">
            + Add New Instructor
          </TableCell>
        </TableRow>
        {instructors?.map((instructor, index) => (
          <TableRow key={index}>
            <TableCell key="sn">{index + 1}</TableCell>
            <TableCell key="name">{instructor["name"]}</TableCell>
            <TableCell key="expertise">{instructor["expertise"]}</TableCell>
            <TableCell key="bio">{instructor["bio"]}</TableCell>
            <TableCell key="created_at">
              {new Date(instructor["created_at"]).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              <Button
                onClick={() => router.push(`/dashboard/instructor/${instructor.id}/courses`)}
                className="cursor-pointer"
              >
                View {instructor["courses_count"]} Courses
              </Button>
            </TableCell>
            <TableCell className="text-right">
              <TableRowMenu id={instructor.id} onEdit={onEditClick} onDelete={onDelete} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
