
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { User } from "@/lib/types/common";

interface TableRowMenuProps {
    user: User
    onEdit: (user: User) => void,
    onDelete: () => void
}

export function TableRowMenu({ user, onEdit, onDelete }: TableRowMenuProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(user)}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}



