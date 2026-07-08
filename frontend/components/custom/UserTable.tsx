
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

  return (
    <Table>
      <TableHeader className="bg-gray-100 w-full">
        <TableRow>
          {/* {headers.map((header) => ( */}
            <TableHead key="sn">S.N.</TableHead>
            <TableHead key="name">Name</TableHead>
            <TableHead key="email">Email</TableHead>
          {/* ))} */}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          className="cursor-pointer hover:bg-gray-200"
          onClick={onAdd}
        >
          <TableCell
            colSpan={4}
            className="font-medium text-center"
          >
            + Add New User
          </TableCell>
        </TableRow>
        {users?.map((user, index) => (
          <TableRow key={index}>
              <TableCell key="sn">{index+1}</TableCell>
              <TableCell key="name">{user["name"]}</TableCell>
              <TableCell key="email">{user["email"]}</TableCell>
            <TableCell className="text-right">
              <TableRowMenu id={user.id} onEdit={onEditClick} onDelete={onDelete}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
