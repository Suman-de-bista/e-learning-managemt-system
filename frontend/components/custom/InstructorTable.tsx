import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Instructor, User } from "@/lib/types/common";
import { useEffect, useState } from "react";

interface UserProps {
    users: User[];
}   

export function InstructorTable() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    // fetchUsers().then((data) => setUsers(data))
    // console.log(users)
  }, []);

  const headers = instructors?.length > 0 ? Object.keys(instructors[0]) : [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {instructors?.map((instructor, index) => (
          <TableRow key={index}>
            {headers?.map((header) => (
              <TableCell key={header}>{instructor[header]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
