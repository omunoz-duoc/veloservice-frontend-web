import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";

export default function AdminLoginRoute() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: `
          radial-gradient(1200px 600px at 80% -10%, rgba(107,91,209,.18), transparent 60%),
          radial-gradient(900px 500px at -10% 110%, rgba(200,90,42,.14), transparent 60%),
          linear-gradient(180deg, #efece4 0%, #e7e3d8 100%)
        `,
      }}
    >
      <div className="w-full max-w-[420px]">
        <div className="bg-white/70 backdrop-blur-sm border border-[#e9dfd0] rounded-[24px] p-8 shadow-sm">
          <AdminLoginForm />
        </div>

        <div className="text-center text-[11px] text-[#8a7f70] mt-5 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-vs-good" />
            Sistema operativo
          </span>
          <span>·</span>
          <span className="hover:text-vs-ink cursor-pointer">Privacidad</span>
          <span className="hover:text-vs-ink cursor-pointer">Términos</span>
          <span className="hover:text-vs-ink cursor-pointer">Estado</span>
        </div>
      </div>
    </div>
  );
}
