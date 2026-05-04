export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: add PanelShell (sidebar + topbar) in next iteration
  // TODO: uncomment auth guard when real auth is implemented:
  // const { user } = useAuthStore()
  // if (!user) redirect("/login")
  return <div className="min-h-screen bg-vs-bg">{children}</div>;
}
