import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {  CourseResponse } from "@/lib/types/common";
import { TableRowMenu } from "./TableRowMenu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface CoursesTableProps {
  courses: CourseResponse[] | null,
  onEditClick: (id:number)=>void,
  onAdd: () => void,
  onDelete: (id: number) => void
}

export function CourseTable({courses , onEditClick, onAdd, onDelete}: CoursesTableProps) {
 const router = useRouter();

    return (
      <Table>
        <TableHeader className="bg-gray-100 w-full">
          <TableRow>
              <TableHead key="sn">S.N</TableHead>
              <TableHead key="instructor_id">Instructor Name</TableHead>
              <TableHead key="title">Title</TableHead>
              <TableHead key="level">Level</TableHead>
              <TableHead key="duration_hours">Duration Hours</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            className="cursor-pointer hover:bg-gray-200"
            onClick={onAdd}
          >
            <TableCell
              colSpan={6}
              className="font-medium text-center"
            >
              + Add New Course
            </TableCell>
          </TableRow>
          {courses?.map((course, index) => (
            <TableRow key={index}>
                <TableCell key="sn">{index+1}</TableCell>
                <TableCell key="instructor_id">{course["instructor_name"]}</TableCell>
                <TableCell key="title">{course["title"]}</TableCell>
                <TableCell key="level">{course["level"]}</TableCell>
                <TableCell key="duration_hours">{course["duration_hours"]}</TableCell>
              <TableCell className="text-right">
                <TableRowMenu id={course.id} onEdit={onEditClick} onDelete={onDelete}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}
