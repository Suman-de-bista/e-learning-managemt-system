
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/lib/types/common";
import { TableRowMenu } from "./TableRowMenu";
import { useState } from "react";

interface UserTableProps {
  users: User[] | null,
  onEditClick: (id:number)=>void,
  onAdd: () => void,
  onDelete: (id: number) => void
}

export function UserTable({ users, onEditClick, onAdd, onDelete }: UserTableProps) {

  const headers = users?.length ?? 0 > 0 ? Object.keys(users? users[0]: []) : [];
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
            colSpan={headers.length + 1}
            className="font-medium text-center"
          >
            + Add New User
          </TableCell>
        </TableRow>
        {users?.map((user, index) => (
          <TableRow key={index}>
            {headers?.map((header) => (
              <TableCell key={header}>{user[header]}</TableCell>
            ))}
            <TableCell className="text-right">
              <TableRowMenu id={user.id} onEdit={onEditClick} onDelete={onDelete}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
