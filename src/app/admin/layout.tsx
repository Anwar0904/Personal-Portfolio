import AdminShell from "@/components/admin/layout/admin-shell";
import '../globals.css'
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminShell>{children}</AdminShell>;
}