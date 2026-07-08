import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Course } from "@/lib/types/common";
import { TableRowMenu } from "./TableRowMenu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface CoursesTableProps {
  courses: Course[] | null,
  onEditClick: (id:number)=>void,
  onAdd: () => void,
  onDelete: (id: number) => void
}

export function CourseTable({courses , onEditClick, onAdd, onDelete}: CoursesTableProps) {
 const router = useRouter();

  const headers = courses?.length ?? 0 > 0 ? Object.keys(courses? courses[0]: []) : [];
  console.log(headers)
    return (
      <Table>
        <TableHeader className="bg-gray-100 w-full">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            className="cursor-pointer hover:bg-gray-200"
            onClick={onAdd}
          >
            <TableCell
              colSpan={headers.length + 2}
              className="font-medium text-center"
            >
              + Add New Course
            </TableCell>
          </TableRow>
          {courses?.map((course, index) => (
            <TableRow key={index}>
              {headers?.map((header) => (
                <TableCell key={header}>{course[header]}</TableCell>
              ))}
              <TableCell className="text-right">
                <TableRowMenu id={course.id} onEdit={onEditClick} onDelete={onDelete}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}
