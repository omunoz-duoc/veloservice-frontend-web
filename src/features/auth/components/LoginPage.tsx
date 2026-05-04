"use client";

import { useState } from "react";
import { Logo } from "@/components/common/Logo";
import { AuthBranding } from "./shared/AuthBranding";
import { AuthCard } from "./shared/AuthCard";
import { LoginForm } from "./LoginForm";
import { RecoverForm } from "./RecoverForm";
import { RegisterForm } from "./RegisterForm";

type View = "login" | "recover" | "register";

export function LoginPage() {
  const [view, setView] = useState<View>("login");

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: `
          radial-gradient(1200px 600px at 80% -10%, rgba(107,91,209,.18), transparent 60%),
          radial-gradient(900px 500px at -10% 110%, rgba(200,90,42,.14), transparent 60%),
          linear-gradient(180deg, #efece4 0%, #e7e3d8 100%)
        `,
      }}
    >
      <AuthBranding />

      <main className="flex-1 flex items-center justify-center p-6 lg:p-10 min-w-0">
        <div className="w-full max-w-[460px]">
          <div className="lg:hidden mb-6">
            <Logo />
          </div>

          <AuthCard>
            {view === "login" && (
              <LoginForm
                onRecover={() => setView("recover")}
                onRegister={() => setView("register")}
              />
            )}
            {view === "recover" && (
              <RecoverForm onBack={() => setView("login")} />
            )}
            {view === "register" && (
              <RegisterForm onBack={() => setView("login")} />
            )}
          </AuthCard>

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
      </main>
    </div>
  );
}
