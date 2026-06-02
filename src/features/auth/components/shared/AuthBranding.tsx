import { Zap, Shield, Briefcase } from "lucide-react";
import { Logo } from "@/components/common/Logo";

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div 
      className="bg-white/5 border border-white/10 rounded-2xl p-3.5" 
      style={{ background: "linear-gradient(180deg, #111418 0%, #1d2128 100%)" }}>
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#f3ede6] mb-2">
        {icon}
      </div>
      <div className="text-[12.5px] font-semibold">{title}</div>
      <div className="text-[11px] text-white/55 mt-0.5 leading-snug">{desc}</div>
    </div>
  );
}

export function AuthBranding() {
  return (
    <aside
      className="hidden lg:flex w-[44%] text-white p-12 flex-col relative overflow-hidden"
      // style={{ background: "linear-gradient(180deg, #111418 0%, #1d2128 100%)" }}
      style={{ background: `url("/images/branding-bg.png") no-repeat center center / cover` }}
    >
      {/* <Image
        src="/images/branding-bg.png"
        alt="Branding background"
        fill
        sizes="44vw"
        className="absolute inset-0 object-cover  opacity-20 -z-10"
        priority
        quality={75}
      /> */}

      <Logo inverted />
      <div className="flex-1 flex flex-col justify-center max-w-[440px]">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black/60 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c85a2a]" />
          Panel administrativo · v0.1
        </div>
        <h1 className="text-[40px] font-extrabold tracking-tight leading-[1.05] text-black/70">
          El cerebro operativo de tu taller de bicicletas.
        </h1>
        <p className="text-[14px] text-black/65 mt-4 leading-relaxed">
          Gestiona órdenes, mecánicos, inventario, finanzas y proveedores desde un
          solo lugar. Diseñado para talleres de 1 a 30 mecánicos.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-8">
          <Feature
            icon={<Zap size={16} />}
            title="Pipeline en vivo"
            desc="Recepción → diagnóstico → reparación → retiro."
          />
          <Feature
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="6" cy="16" r="4" /><circle cx="18" cy="16" r="4" />
                <path d="M6 16 10 7h5l3 9" /><path d="M10 7h-2M14 7l2 4" />
              </svg>
            }
            title="Bicis & e-bikes"
            desc="Mantenciones, motor Bosch/Shimano, firmware."
          />
          <Feature
            icon={<Shield size={16} />}
            title="Roles granulares"
            desc="Mecánico, recepción, jefe, administrador."
          />
          <Feature
            icon={<Briefcase size={16} />}
            title="Compras al día"
            desc="OCs, recepción y stock automatizados."
          />
        </div>
      </div>
      <div className="border-t border-white/10 pt-5 flex items-center gap-6 text-[11px] text-white/50">
        <span>© 2026 VeloService SpA</span>
        <span>·</span>
        <span className="hover:text-white cursor-pointer">Estado del sistema</span>
        <span className="hover:text-white cursor-pointer">Soporte</span>
        <span className="hover:text-white cursor-pointer">Términos</span>
      </div>
    </aside>
  );
}
