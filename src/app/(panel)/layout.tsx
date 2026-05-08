import { PanelShell } from "@/features/panel/components/layout/PanelShell"
import { OrdenesProvider } from "@/features/panel/context/OrdenesContext"

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrdenesProvider>
      <PanelShell>{children}</PanelShell>
    </OrdenesProvider>
  )
}
