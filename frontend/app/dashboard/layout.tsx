"use client";

import { NavBar } from "@/components/custom/NavBar";
import { useSession } from "@/lib/context/SessionContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading } = useSession();

  if (loading) {
    return null;
  }

  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
