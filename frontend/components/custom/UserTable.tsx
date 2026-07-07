
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/lib/types/common";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/apis/users";
import { TableRowMenu } from "./TableRowMenu";


export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data))
  }, []);

  const headers = users?.length > 0 ? Object.keys(users[0]) : [];
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
        {users?.map((user, index) => (
          <TableRow key={index}>
            {headers?.map((header) => (
              <TableCell key={header}>{user[header]}</TableCell>
            ))}
            <TableCell className="text-right">
              <TableRowMenu />
          </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
