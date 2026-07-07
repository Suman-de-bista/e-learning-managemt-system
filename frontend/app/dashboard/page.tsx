'use client';
import { AddUserModal } from "@/components/custom/AddUserModal";
import { InstructorTable } from "@/components/custom/InstructorTable";
import { UserTable } from "@/components/custom/UserTable";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";


export default function LoginForm() {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    return (
        <div className="flex min-h-screen flex-col w-full">
            <div>Dashboard</div>
            <div className="flex min-h-screen flex-col w-full items-center py-20">
                <Tabs defaultValue="overview" className="w-full items-center">
                    <TabsList className="flex w-1/2 m-auto">
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="instructor">Instructor</TabsTrigger>
                    </TabsList>
                    <div className="w-8/10 h-full flex m-auto py-10">
                        <TabsContent value="users">
                            <UserTable onAdd={() => setIsAddUserModalOpen(true)} />
                        </TabsContent>
                        <TabsContent value="instructor">
                            <InstructorTable />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />
        </div>
    );
}
