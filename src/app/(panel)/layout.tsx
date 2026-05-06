import { PanelShell } from "@/features/panel/components/layout/PanelShell"

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell>{children}</PanelShell>
}
