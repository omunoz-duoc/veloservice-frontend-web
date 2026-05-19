import { AdminShell } from "@/features/admin/components/layout/AdminShell"
import { AdminAuthGuard } from "@/features/admin/components/layout/AdminAuthGuard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  )
}
