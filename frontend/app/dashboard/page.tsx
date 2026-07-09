'use client';
import { AddUserModal } from "@/components/custom/AddUserModal";
import { EditUserModal } from "@/components/custom/EdituserModal";
import { InstructorTable } from "@/components/custom/InstructorTable";
import { UserSortKey, UserTable } from "@/components/custom/UserTable";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { deleteUser, fetchUserById, fetchUsers } from "@/lib/apis/users";
import { Instructor, InstructorResponse, User } from "@/lib/types/common";
import { useEffect, useRef, useState } from "react";
import { deleteInstructor, exportInstructorCSV, fetchInstructorById, fetchInstructors, importInstructorCSV } from "@/lib/apis/instructors";
import { AddInstructorModal } from "@/components/custom/AddInstructorModal";
import { EditInstructorModal } from "@/components/custom/EditInstructorModal";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/custom/SearchInput";

type activeTabs = "users" | "instructors";


export default function LoginForm() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [instructors, setInstructors] = useState<InstructorResponse[] | null>(null);
    const [activeTab, setActiveTab] = useState<activeTabs>("users");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isAddInstructorModalOpen, setIsAddInstructorModalOpen] = useState(false);
    const [isEditInstructorModalOpen, setIsEditInstructorModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editInstructor, setEditInstructor] = useState<Instructor | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [userSortKey, setUserSortKey] = useState<UserSortKey | null>(null);
    const [userSortDirection, setUserSortDirection] = useState<"asc" | "desc">("asc");
    const [userSearch, setUserSearch] = useState<string | null>(null);
    const limit = 10;

    const loadUsers = (
        targetPage: number = page,
        search: string | null = userSearch,
        sortBy: UserSortKey | null = userSortKey,
        sortOrder: "asc" | "desc" = userSortDirection
    ) => {
        fetchUsers(search, targetPage, limit, sortBy, sortOrder).then((data) => {
            setUsers(data.items)
            setTotalPages(data.total_pages)
        })
    }

    const handleUserSortChange = (key: UserSortKey) => {
        const nextDirection = userSortKey === key && userSortDirection === "asc" ? "desc" : "asc";
        setUserSortKey(key);
        setUserSortDirection(nextDirection);
        setPage(1);
        loadUsers(1, userSearch, key, nextDirection);
    }

    const loadInstructors = (targetPage: number = page, search:string | null = null) => {
        fetchInstructors(search, targetPage, limit).then((data) => {
            setInstructors(data.items)
            setTotalPages(data.total_pages)
        })
    }

    const handleExportCSV = async () => {
        const blob = await exportInstructorCSV();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "instructors.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImporting(true);
        importInstructorCSV(file)
            .then(() => loadInstructors())
            .catch((err) => console.log(err))
            .finally(() => {
                setImporting(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            })
    }

    const searchUserHandler = (query: string) =>{
        setUserSearch(query)
        setPage(1)
        loadUsers(1,query)
    }

    const searchInstructorHandler = (query: string) =>{
        setPage(1)
        loadInstructors(1,query)
    }

    useEffect(() => {
        if (activeTab == "users") {
            loadUsers(page)
        }
        else if (activeTab == "instructors") {
            loadInstructors(page)
        }

    }, [activeTab, page])

    return (
        <div className="flex min-h-screen flex-col w-full">
            <div className="flex min-h-screen flex-col w-full items-center py-20">
                <Tabs
                    value={activeTab}
                    onValueChange={(val) => {
                        setActiveTab(val)
                        setPage(1)
                    }}
                    className="w-full items-center"
                >
                    <TabsList className="flex w-1/2 m-auto">
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="instructors">Instructor</TabsTrigger>
                    </TabsList>
                    <div className="w-8/10 h-full flex m-auto py-10">
                        <TabsContent value="users">
                            <div className="flex w-full gap-8 justify-end my-2 p-4">
                                <div className="flex w-full justify-end">
                                    <SearchInput 
                                        onSearch={searchUserHandler}
                                    />
                                </div>
                            </div>
                            <UserTable
                                users={users}
                                onAdd={() => setIsAddUserModalOpen(true)}
                                onEditClick={(id) => {
                                    setIsEditUserModalOpen(true)
                                    fetchUserById(id).then((user) => setEditUser(user))
                                }}
                                onDelete={(id) => {
                                    deleteUser(id).then(() => loadUsers())
                                }}
                                sortKey={userSortKey}
                                sortDirection={userSortDirection}
                                onSortChange={handleUserSortChange}
                            />
                            <Pagination className="py-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            aria-disabled={page <= 1}
                                            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPage((p) => Math.max(1, p - 1))
                                            }}
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <span className="px-4 text-sm">Page {page} of {totalPages}</span>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            aria-disabled={page >= totalPages}
                                            className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPage((p) => Math.min(totalPages, p + 1))
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </TabsContent>
                        <TabsContent value="instructors">
                            <div className="flex w-full gap-8 justify-end my-2 p-4">
                                <div className="flex w-full justify-end">
                                    <SearchInput
                                        onSearch={searchInstructorHandler}
                                    />
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleImportCSV}
                                />
                                <Button disabled={importing} onClick={() => fileInputRef.current?.click()}>Import CSV</Button>
                                <Button onClick={handleExportCSV}>Export CSV</Button>
                            </div>
                            <InstructorTable
                                instructors={instructors}
                                onAdd={() => setIsAddInstructorModalOpen(true)}
                                onEditClick={(id) => {
                                    setIsEditInstructorModalOpen(true)
                                    fetchInstructorById(id).then((instructor) => setEditInstructor(instructor))
                                }}
                                onDelete={(id) => {
                                    deleteInstructor(id).then(() => loadInstructors())
                                }}
                            />
                            <Pagination className="py-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            aria-disabled={page <= 1}
                                            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPage((p) => Math.max(1, p - 1))
                                            }}
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <span className="px-4 text-sm">Page {page} of {totalPages}</span>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            aria-disabled={page >= totalPages}
                                            className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPage((p) => Math.min(totalPages, p + 1))
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSuccess={() => {
                    setIsAddUserModalOpen(false)
                    loadUsers()
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
                        loadUsers()
                    }}
                />
            }
            <AddInstructorModal
                isOpen={isAddInstructorModalOpen}
                onClose={() => setIsAddInstructorModalOpen(false)}
                onSuccess={() => {
                    setIsAddInstructorModalOpen(false)
                    loadInstructors()
                }}
            />
            {editInstructor &&
                <EditInstructorModal
                    instructor={editInstructor}
                    isOpen={isEditInstructorModalOpen}
                    onClose={() => {
                        setIsEditInstructorModalOpen(false)
                        setEditInstructor(null)
                    }}
                    onSuccess={() => {
                        setIsEditInstructorModalOpen(false)
                        setEditInstructor(null)
                        loadInstructors()
                    }}
                />
            }

        </div>
    );
}
