import { PanelShell } from "@/features/panel/components/layout/PanelShell"
import { OrdenesProvider } from "@/features/panel/context/OrdenesContext"
import { AuthGuard } from "@/features/auth/components/AuthGuard"

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OrdenesProvider>
        <PanelShell>{children}</PanelShell>
      </OrdenesProvider>
    </AuthGuard>
  )
}
