'use client';
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/context/SessionContext'

export const NavBar = () => {
    const router = useRouter();
    const { user, logout } = useSession();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    }
    return (
        <div className="flex w-full bg-blue-400 py-4 px-8 justify-between text-center">
            <Button
                variant="ghost"
                className="text-white text-md my-auto hover:bg-transparent hover:text-white hover:cursor-pointer"
                onClick={()=> router.push('/dashboard')}
            >
                ELMS.
            </Button>
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    className="text-white text-md hover:bg-transparent hover:text-white hover:cursor-pointer"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </div>
    )
}
