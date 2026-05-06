import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

export function PanelShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-vs-bg">
      <Sidebar />
      <main className="flex-1 px-8 py-7 min-w-0">
        <Topbar />
        {children}
      </main>
    </div>
  )
}
