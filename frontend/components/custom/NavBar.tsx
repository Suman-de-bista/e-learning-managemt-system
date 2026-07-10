"use client";
import React from "react";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";

export const NavBar = () => {
  const router = useRouter();
  const { user, logout } = useSession();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
  return (
    <div className="flex w-full bg-blue-400 py-4 px-8 justify-between text-center">
      <Button
        variant="ghost"
        className="text-white text-md my-auto hover:bg-transparent hover:text-white hover:cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        ELMS.
      </Button>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer outline-none">
            <Avatar name={user.name} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
