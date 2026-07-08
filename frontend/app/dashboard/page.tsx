'use client';
import { AddUserModal } from "@/components/custom/AddUserModal";
import { EditUserModal } from "@/components/custom/EdituserModal";
import { InstructorTable } from "@/components/custom/InstructorTable";
import { UserTable } from "@/components/custom/UserTable";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { deleteUser, fetchUsers } from "@/lib/apis/users";
import { Instructor, User } from "@/lib/types/common";
import { useEffect, useState } from "react";

type activeTabs = "users" | "instructors";


export default function LoginForm() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [instructors, setInstructors] = useState<Instructor[] | null>(null);
    const [activeTab, setActiveTab] = useState<activeTabs>("users");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);


    useEffect(() => {
        if (activeTab == "users") {
            fetchUsers().then((data) => setUsers(data))
        }
        else if (activeTab == "instructors") {

        }

    }, [activeTab])

    return (
        <div className="flex min-h-screen flex-col w-full">
            <div>Dashboard</div>
            <div className="flex min-h-screen flex-col w-full items-center py-20">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full items-center">
                    <TabsList className="flex w-1/2 m-auto">
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="instructors">Instructor</TabsTrigger>
                    </TabsList>
                    <div className="w-8/10 h-full flex m-auto py-10">
                        <TabsContent value="users">
                            <UserTable 
                                users={users} 
                                onAdd={() => setIsAddUserModalOpen(true)} 
                                onEditClick={(user) => {
                                    setIsEditUserModalOpen(true)
                                    setEditUser(user)
                                }}
                                onDelete={(id) => {
                                    deleteUser(id).then(()=> fetchUsers().then((data) => setUsers(data)))
                                }}
                             />
                        </TabsContent>
                        <TabsContent value="instructors">
                            <InstructorTable />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSuccess={() => {
                    setIsAddUserModalOpen(false)
                    fetchUsers().then((data) => setUsers(data))
                }}
            />
            {editUser &&
                <EditUserModal
                    user={editUser}
                    isOpen={isEditUserModalOpen}
                    onClose={() => {
                        setIsEditUserModalOpen(false)
                        setEditUser(null)
                    }}
                    onSuccess={() => {
                        setIsEditUserModalOpen(false)
                        setEditUser(null)
                        fetchUsers().then((data) => setUsers(data))
                    }}
                />
            }

        </div>
    );
}
