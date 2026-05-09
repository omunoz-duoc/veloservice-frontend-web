"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Check } from "lucide-react";
import { Field } from "@/components/common/Field";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.2 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.3-.4-3.5" />
    </svg>
  );
}

interface LoginFormProps {
  onRecover: () => void;
  onRegister: () => void;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: "No encontramos una cuenta con ese correo electrónico.",
  INVALID_PASSWORD: "La contraseña es incorrecta. Verifica tus datos e intenta de nuevo.",
};

export function LoginForm({ onRecover, onRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const router = useRouter();
  const { mutateAsync: loginAsync, isPending } = useLogin();
  const { error, setError } = useAuthStore();
  const [soonTM, setSoonTM] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      await loginAsync({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.body?.message) {
        setError(err.body.message);
      } else {
        setError("Ocurrió un error inesperado. Intenta de nuevo.");
      }
    }
  };

  function showSoonTM() {
    setSoonTM(true);
  }

  const validateFields = () => {
    const errors = {
      email: !email,
      password: !password,
    };
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-[26px] font-semibold tracking-tight">
          Bienvenid@
        </h2>
        <p className="text-[13px] text-[#8a7f70] mt-1">
          Ingresa con tu cuenta corporativa para acceder al panel del taller.
        </p>
      </div>

      <div className={fieldErrors.email ? "border-red-500" : ""}>
        <Field
          icon={<Mail size={18} />}
          type="email"
          placeholder="admin@veloservice.cl"
          value={email}
          onChange={setEmail}
          autoFocus
        />
      </div>

      <div className={fieldErrors.password ? "border-red-500" : ""}>
        <Field
          icon={<Lock size={18} />}
          type={showPwd ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={setPassword}
          suffix={
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="text-[#a59682] hover:text-vs-ink transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRemember(!remember)}
          className="flex items-center gap-2 text-[12.5px] text-[#4a4438] invisible"
        >
          <span
            className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${
              remember ? "bg-vs-ink border-vs-ink text-white" : "border-[#c7bba6]"
            }`}
          >
            {remember && <Check size={12} />}
          </span>
          Mantener sesión por 30 días
        </button>
        <button
          type="button"
          onClick={onRecover}
          className="text-[12.5px] text-vs-violet font-medium hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors disabled:opacity-60"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verificando…
          </>
        ) : (
          <>
            Ingresar al panel <ArrowRight size={18} />
          </>
        )}
      </button>

      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-vs-line-2" />
        <span className="text-[10.5px] text-[#a59682] uppercase tracking-widest">
          o continúa con
        </span>
        <div className="flex-1 h-px bg-vs-line-2" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={showSoonTM}
          className="flex items-center justify-center gap-2 bg-vs-chip py-2.5 rounded-full text-[12.5px] font-medium hover:bg-[#ebe3d6] transition-colors"
        >
          <GoogleIcon /> Google Workspace
        </button>
        <button
          type="button"
          onClick={showSoonTM}
          className="flex items-center justify-center gap-2 bg-vs-chip py-2.5 rounded-full text-[12.5px] font-medium hover:bg-[#ebe3d6] transition-colors"
        >
          <span className="text-vs-violet">
            <Shield size={18} />
          </span>
          SSO corporativo
        </button>
      </div>

      <div className="text-center text-[12.5px] text-[#8a7f70] pt-2">
        ¿Aún no tienes cuenta?{" "}
        <button
          type="button"
          onClick={onRegister}
          className="text-vs-ink font-semibold hover:underline"
        >
          Solicitar acceso
        </button>
      </div>
      <AlertDialog open={!!error} onOpenChange={(open) => { if (!open) setError(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al iniciar sesión</AlertDialogTitle>
            <AlertDialogDescription>
              {error
                ? AUTH_ERROR_MESSAGES[error] ?? "Ocurrió un error inesperado. Intenta de nuevo."
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!soonTM} onOpenChange={(open) => { if (!open) setSoonTM(false)}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Próximamente</AlertDialogTitle>
            <AlertDialogDescription>
              Esta funcionalidad estará disponible en una próxima actualización. Si quieres ser de los primeros en probarla, contáctanos para unirte a nuestro programa de early access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSoonTM(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
