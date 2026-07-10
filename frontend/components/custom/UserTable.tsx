import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/types/common";
import { TableRowMenu } from "./TableRowMenu";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export type UserSortKey = "name" | "email" | "created_at";
export type SortDirection = "asc" | "desc";

interface UserTableProps {
  users: User[] | null;
  onEditClick: (id: number) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  sortKey?: UserSortKey | null;
  sortDirection?: SortDirection;
  onSortChange?: (key: UserSortKey) => void;
}

export function UserTable({
  users,
  onEditClick,
  onAdd,
  onDelete,
  sortKey = null,
  sortDirection = "asc",
  onSortChange,
}: UserTableProps) {
  const renderSortIcon = (key: UserSortKey) => {
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
            key="email"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("email")}
          >
            Email{renderSortIcon("email")}
          </TableHead>
          <TableHead
            key="created_at"
            className="cursor-pointer select-none"
            onClick={() => onSortChange?.("created_at")}
          >
            Created At{renderSortIcon("created_at")}
          </TableHead>
          {/* ))} */}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="cursor-pointer hover:bg-gray-200" onClick={onAdd}>
          <TableCell colSpan={5} className="font-medium text-center">
            + Add New User
          </TableCell>
        </TableRow>
        {users?.map((user, index) => (
          <TableRow key={index}>
            <TableCell key="sn">{index + 1}</TableCell>
            <TableCell key="name">{user["name"]}</TableCell>
            <TableCell key="email">{user["email"]}</TableCell>
            <TableCell key="created_at">{new Date(user["created_at"]).toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <TableRowMenu id={user.id} onEdit={onEditClick} onDelete={onDelete} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
