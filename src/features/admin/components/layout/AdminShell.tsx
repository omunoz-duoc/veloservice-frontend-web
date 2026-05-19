import type { ReactNode } from "react"
import { AdminSidebar } from "./AdminSidebar"
import { AdminTopbar } from "./AdminTopbar"

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-vs-bg">
      <AdminSidebar />
      <main className="flex-1 px-8 py-7 min-w-0">
        <AdminTopbar />
        {children}
      </main>
    </div>
  )
}
