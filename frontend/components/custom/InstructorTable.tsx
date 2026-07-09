import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InstructorResponse } from "@/lib/types/common";
import { TableRowMenu } from "./TableRowMenu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface InstructorTableProps {
  instructors: InstructorResponse[] | null,
  onEditClick: (id:number)=>void,
  onAdd: () => void,
  onDelete: (id: number) => void
}

export function InstructorTable({instructors, onAdd, onEditClick, onDelete }: InstructorTableProps) {
 const router = useRouter();

    return (
      <Table>
        <TableHeader className="bg-gray-100 w-full">
          <TableRow>
              <TableHead key="sn">S.N.</TableHead>
              <TableHead key="name">Name</TableHead>
              <TableHead key="expertise">Expertise</TableHead>
              <TableHead key="bio">Bio</TableHead>
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
              colSpan={6}
              className="font-medium text-center"
            >
              + Add New Instructor
            </TableCell>
          </TableRow>
          {instructors?.map((instructor, index) => (
            <TableRow key={index}>
                <TableCell key="sn">{index+1}</TableCell>
                <TableCell key="name">{instructor["name"]}</TableCell>
                <TableCell key="expertise">{instructor["expertise"]}</TableCell>
                <TableCell key="bio">{instructor["bio"]}</TableCell>
              <TableCell className="text-right">
                <Button onClick={()=> router.push(`/dashboard/instructor/${instructor.id}/courses`) } className="cursor-pointer">View {instructor["courses_count"]} Courses</Button>
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
