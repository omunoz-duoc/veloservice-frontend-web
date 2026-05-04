"use client";

import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { Mail } from "lucide-react";
import { Field } from "@/components/common/Field";
import { PasswordMeter } from "./PasswordMeter";
import {
  useRecoverPassword,
  useVerifyCode,
  useResetPassword,
} from "@/features/auth/hooks/useAuth";

interface RecoverFormProps {
  onBack: () => void;
}

export function RecoverForm({ onBack }: RecoverFormProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: sendCode, isPending: isSending } = useRecoverPassword();
  const { mutate: verify, isPending: isVerifying } = useVerifyCode();
  const { mutate: reset, isPending: isResetting } = useResetPassword();

  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] text-[#8a7f70] hover:text-vs-ink transition-colors"
      >
        <ArrowLeft size={16} /> Volver al inicio de sesión
      </button>

      {step === 1 && (
        <>
          <div>
            <h2 className="text-[26px] font-semibold tracking-tight">
              Recuperar contraseña
            </h2>
            <p className="text-[13px] text-[#8a7f70] mt-1">
              Te enviaremos un código de 6 dígitos al correo asociado a tu cuenta.
            </p>
          </div>
          <Field
            icon={<Mail size={18} />}
            type="email"
            placeholder="tu@veloservice.cl"
            value={email}
            onChange={setEmail}
            autoFocus
            hint="Solo se aceptan correos del dominio @veloservice.cl"
          />
          <button
            onClick={() => sendCode(email, { onSuccess: () => setStep(2) })}
            disabled={isSending || !email}
            className="w-full flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors disabled:opacity-60"
          >
            {isSending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Enviar código <ArrowRight size={18} /></>
            )}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <h2 className="text-[26px] font-semibold tracking-tight">
              Revisa tu correo
            </h2>
            <p className="text-[13px] text-[#8a7f70] mt-1">
              Enviamos un código a{" "}
              <b className="text-vs-ink">{email}</b>. Ingrésalo a continuación.
            </p>
          </div>
          <div className="flex justify-between gap-2">
            {code.map((c, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                value={c}
                onChange={(e) => setDigit(i, e.target.value)}
                maxLength={1}
                className="w-12 h-14 text-center text-[22px] font-semibold font-mono bg-[#f7f3eb] border border-vs-line-2 rounded-xl outline-none focus:border-vs-ink focus:bg-white transition-colors"
              />
            ))}
          </div>
          <div className="text-center text-[12px] text-[#8a7f70]">
            ¿No te llegó?{" "}
            <button className="text-vs-violet font-medium hover:underline">
              Reenviar código
            </button>
          </div>
          <button
            onClick={() =>
              verify(code.join(""), { onSuccess: (ok) => { if (ok) setStep(3); } })
            }
            disabled={isVerifying || code.some((d) => !d)}
            className="w-full flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors disabled:opacity-60"
          >
            {isVerifying ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Verificar código <ArrowRight size={18} /></>
            )}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <h2 className="text-[26px] font-semibold tracking-tight">
              Define tu nueva contraseña
            </h2>
            <p className="text-[13px] text-[#8a7f70] mt-1">
              Mínimo 10 caracteres con mayúscula, número y símbolo.
            </p>
          </div>
          <Field
            icon={<Lock size={18} />}
            type="password"
            placeholder="Nueva contraseña"
            value={pwd1}
            onChange={setPwd1}
          />
          <PasswordMeter password={pwd1} />
          <Field
            icon={<Lock size={18} />}
            type="password"
            placeholder="Confirmar contraseña"
            value={pwd2}
            onChange={setPwd2}
            error={pwd2 && pwd1 !== pwd2 ? "Las contraseñas no coinciden" : undefined}
          />
          <button
            onClick={() => reset(pwd1, { onSuccess: () => setStep(4) })}
            disabled={isResetting || !pwd1 || pwd1 !== pwd2}
            className="w-full flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors disabled:opacity-60"
          >
            {isResetting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Actualizar contraseña <Check size={18} /></>
            )}
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-full bg-vs-good-bg text-vs-good flex items-center justify-center mx-auto mb-3">
              <Check size={28} />
            </div>
            <h2 className="text-[22px] font-semibold tracking-tight">
              Contraseña actualizada
            </h2>
            <p className="text-[13px] text-[#8a7f70] mt-1">
              Ya puedes ingresar al panel con tu nueva contraseña.
            </p>
          </div>
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors"
          >
            Ir al inicio de sesión <ArrowRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
