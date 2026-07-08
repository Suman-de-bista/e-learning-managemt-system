import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Instructor, User } from "@/lib/types/common";
import { TableRowMenu } from "./TableRowMenu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface InstructorTableProps {
  instructors: Instructor[] | null,
  onEditClick: (id:number)=>void,
  onAdd: () => void,
  onDelete: (id: number) => void
}

export function InstructorTable({instructors, onAdd, onEditClick, onDelete }: InstructorTableProps) {
 const router = useRouter();

  const headers = instructors?.length ?? 0 > 0 ? Object.keys(instructors? instructors[0]: []) : [];
  console.log(headers)
    return (
      <Table>
        <TableHeader className="bg-gray-100 w-full">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TableHead></TableHead>
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
              + Add New Instructor
            </TableCell>
          </TableRow>
          {instructors?.map((instructor, index) => (
            <TableRow key={index}>
              {headers?.map((header) => (
                <TableCell key={header}>{instructor[header]}</TableCell>
              ))}
              <TableCell className="text-right">
                <Button onClick={()=> router.push(`/dashboard/instructor/${instructor.id}/courses`) }>Courses</Button>
              </TableCell>
              <TableCell className="text-right">
                <TableRowMenu id={instructor.id} onEdit={onEditClick} onDelete={onDelete}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}
