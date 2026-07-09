import { NavBar } from "@/components/custom/NavBar";



export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <NavBar/>
        {children}
    </div>
  );
}
