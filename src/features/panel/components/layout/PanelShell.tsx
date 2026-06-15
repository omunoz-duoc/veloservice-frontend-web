import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

export function PanelShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-0 overflow-x-hidden bg-vs-bg">
      <Sidebar />
      <main className="w-0 min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <Topbar />
        {children}
      </main>
    </div>
  )
}
