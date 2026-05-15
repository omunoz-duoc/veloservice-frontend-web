"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, Lock, User, CreditCard, Building2 } from "lucide-react";
import { Field } from "@/components/common/Field";
import { PasswordMeter } from "./PasswordMeter";
import { StepIndicator } from "./shared/StepIndicator";
import { useRegister } from "@/features/auth/hooks/useAuth";
import type { RegisterPayload } from "@/features/auth/services/auth.service";
import { cn } from "@/lib/utils";
import { removeSeparators, useRut } from "react-rut-formatter";
import { PhoneField } from "@/components/common/PhoneField";

const CARGOS_MAP: Record<string, string> = {
  "JEFE_TALLER": "Jefe de taller",
  "ADMIN_SUCURSAL": "Administrador",
  "MECANICO": "Mecánico",
  "RECEPCIONISTA": "Recepción",
};

const CARGOS = Object.values(CARGOS_MAP);

const CARGOS_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CARGOS_MAP).map(([k, v]) => [v, k])
);

const TALLERES_MAP: Record<string, string> = {
  "660e8400-e29b-41d4-a716-446655440001": "VeloService Lo Barnechea",
  "660e8400-e29b-41d4-a716-446655440002": "VeloService Vitacura",
};

function Summary({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-[#8a7f70]">{k}</span>
      <span className={cn("font-medium text-vs-ink truncate max-w-[260px]", mono && "font-mono")}>
        {v}
      </span>
    </div>
  );
}

interface RegisterFormProps {
  onBack: () => void;
}

type FormData = Omit<RegisterPayload, "password"> & {
  password: string;
  password2: string;
  terminos: boolean;
  marketing: boolean;
};

type FormErrors = Partial<Record<"nombre" | "apellido" | "rut" | "telefono" | "email", string>>;

const LETTERS_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RUT_LENGTH = 9;

export function RegisterForm({ onBack }: RegisterFormProps) {
  const { rut, updateRut, isValid: rutIsValid } = useRut();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [data, setData] = useState<FormData>({
    nombre: "",
    apellido: "",
    rut: "",
    telefono: "",
    email: "",
    rol: "ADMIN_SUCURSAL",
    sucursalId: '660e8400-e29b-41d4-a716-446655440001',
    password: "",
    password2: "",
    terminos: false,
    marketing: false,
  });

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setData((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleRutChange = (value: string) => {
    const nextRut = removeSeparators(value).slice(0, MAX_RUT_LENGTH);

    updateRut(nextRut);
    setErrors((prev) => ({ ...prev, rut: undefined }));
  };

  const validateStep1 = (): boolean => {
    const e: FormErrors = {};
    if (!data.nombre.trim()) e.nombre = "Ingresa tu nombre";
    else if (data.nombre.length > 50) e.nombre = "Máximo 50 caracteres";
    else if (!LETTERS_RE.test(data.nombre)) e.nombre = "Solo letras permitidas";

    if (!data.apellido.trim()) e.apellido = "Ingresa tu apellido";
    else if (data.apellido.length > 50) e.apellido = "Máximo 50 caracteres";
    else if (!LETTERS_RE.test(data.apellido)) e.apellido = "Solo letras permitidas";

    if (!rut.raw) e.rut = "Ingresa tu RUT";
    else if (!rutIsValid) e.rut = "RUT inválido";

    const phoneDigits = data.telefono.replace(/^\+56/, "").replace(/\D/g, "");
    if (!data.telefono) e.telefono = "Ingresa tu teléfono";
    else if (phoneDigits.length < 9) e.telefono = "Debe tener 9 dígitos (sin +56)";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: FormErrors = {};
    if (!data.email.trim()) e.email = "Ingresa tu correo";
    else if (!EMAIL_RE.test(data.email)) e.email = "Correo inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const { mutate: register, isPending } = useRegister();

  const handleSubmit = () => {
    register(
      {
        nombre: data.nombre,
        apellido: data.apellido,
        rut: rut.raw || data.rut,
        telefono: data.telefono,
        email: data.email,
        rol: data.rol,
        sucursalId: data.sucursalId,
        password: data.password,
      },
      { onSuccess: () => setStep(4) }
    );
  };

  const canSubmit =
    data.terminos && data.password && data.password === data.password2;

  return (
    <div className="space-y-4">
      {/* StepIndicator has no "completed" state; current>steps turns all dots green */}
      <StepIndicator steps={4} current={step < 4 ? step : 5} />

      {step === 1 && (
        <>
          <div>
            <h2 className="text-[24px] font-semibold tracking-tight">
              Crea tu cuenta
            </h2>
            <p className="text-[13px] text-[#8a7f70] mt-1">
              Paso 1 de 3 · Datos personales del solicitante.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              icon={<User size={18} />}
              placeholder="Nombre"
              value={data.nombre}
              onChange={(v) => set("nombre", v)}
              error={errors.nombre}
              autoFocus
            />
            <Field
              icon={<User size={18} />}
              placeholder="Apellido"
              value={data.apellido}
              onChange={(v) => set("apellido", v)}
              error={errors.apellido}
            />
          </div>
          <Field
            icon={<CreditCard size={18} />}
            placeholder="RUT (12.345.678-9)"
            value={rut.formatted}
            onChange={handleRutChange}
            hint="Sólo se usa para validación de identidad."
            error={errors.rut}
          />
          <PhoneField
            value={data.telefono}
            onChange={(v) => set("telefono", v)}
            error={errors.telefono}
          />
          <button
            onClick={() => { if (validateStep1()) setStep(2); }}
            className="w-full flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors"
          >
            Continuar <ArrowRight size={18} />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <h2 className="text-[24px] font-semibold tracking-tight">
              Información laboral
            </h2>
            <p className="text-[13px] text-[#8a7f70] mt-1">
              Paso 2 de 3 · Tu rol determina los permisos del panel.
            </p>
          </div>
          <Field
            icon={<Mail size={18} />}
            type="email"
            placeholder="Correo corporativo @veloservice.cl"
            value={data.email}
            onChange={(v) => set("email", v)}
            autoFocus
            hint="Te enviaremos el código de verificación a este correo."
            error={errors.email}
          />
          <div className="mb-5">
            <div className="text-[11px] text-[#8a7f70] mb-1.5 ml-1">
              Cargo solicitado
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CARGOS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("rol", CARGOS_REVERSE_MAP[c])}
                  className={cn(
                    "text-left px-3 py-2.5 rounded-xl border text-[12.5px] font-medium transition-colors",
                    data.rol === CARGOS_REVERSE_MAP[c]
                      ? "bg-vs-ink text-white border-vs-ink"
                      : "bg-[#f7f3eb] border-vs-line-2 text-[#4a4438] hover:border-[#c7bba6]"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* <div>
            <div className="text-[11px] text-[#8a7f70] mb-1.5 ml-1">
              Sucursal asignada
            </div>
            <div className="bg-[#f7f3eb] border border-vs-line-2 rounded-[14px] px-[14px] py-3 flex items-center gap-2.5">
              <span className="text-[#a59682] flex-shrink-0">
                <Building2 size={18} />
              </span>
              <select
                value={data.sucursalId}
                onChange={(e) => set("sucursalId", e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm text-vs-ink"
              >
                {Object.entries(TALLERES_MAP).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div> */}
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-full text-[13px] font-medium bg-vs-chip hover:bg-[#ebe3d6] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => { if (validateStep2()) setStep(3); }}
              className="flex-1 flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors"
            >
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <h2 className="text-[24px] font-semibold tracking-tight">
              Seguridad de la cuenta
            </h2>
            <p className="text-[13px] text-[#8a7f70] mt-1">
              Paso 3 de 3 · Tu contraseña debe ser fuerte para proteger los datos
              del taller.
            </p>
          </div>
          <Field
            icon={<Lock size={18} />}
            type="password"
            placeholder="Contraseña"
            value={data.password}
            onChange={(v) => set("password", v)}
          />
          <PasswordMeter password={data.password} />
          <Field
            icon={<Lock size={18} />}
            type="password"
            placeholder="Confirmar contraseña"
            value={data.password2}
            onChange={(v) => set("password2", v)}
            error={
              data.password2 && data.password !== data.password2
                ? "Las contraseñas no coinciden"
                : undefined
            }
          />
          <button
            type="button"
            onClick={() => set("terminos", !data.terminos)}
            className="flex items-start gap-2.5 text-[12px] text-[#4a4438] text-left"
          >
            <span
              className={cn(
                "w-[18px] h-[18px] rounded-[6px] border-[1.5px] flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                data.terminos
                  ? "bg-vs-ink border-vs-ink text-white"
                  : "border-[#c7bba6]"
              )}
            >
              {data.terminos && <Check size={12} />}
            </span>
            <span>
              Acepto los{" "}
              <span className="text-vs-violet font-medium cursor-pointer hover:underline">
                Términos de uso
              </span>{" "}
              y la{" "}
              <span className="text-vs-violet font-medium cursor-pointer hover:underline">
                Política de privacidad
              </span>{" "}
              de VeloService. Confirmo que los datos entregados son verídicos.
            </span>
          </button>
          <button
            type="button"
            onClick={() => set("marketing", !data.marketing)}
            className="flex items-start gap-2.5 text-[12px] text-[#4a4438] text-left"
          >
            <span
              className={cn(
                "w-[18px] h-[18px] rounded-[6px] border-[1.5px] flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                data.marketing
                  ? "bg-vs-ink border-vs-ink text-white"
                  : "border-[#c7bba6]"
              )}
            >
              {data.marketing && <Check size={12} />}
            </span>
            <span>
              Quiero recibir actualizaciones del producto, tips operativos y
              noticias del taller (opcional).
            </span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-3 rounded-full text-[13px] font-medium bg-vs-chip hover:bg-[#ebe3d6] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Solicitar acceso <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-vs-violet-bg text-vs-violet flex items-center justify-center mx-auto mb-3">
              <Mail size={32} />
            </div>
            <h2 className="text-[22px] font-semibold tracking-tight">
              Solicitud enviada
            </h2>
            <p className="text-[13px] text-[#8a7f70] mt-2 leading-relaxed">
              Hola <b className="text-vs-ink">{data.nombre || "—"}</b>, recibimos
              tu solicitud para el rol{" "}
              <b className="text-vs-ink">{CARGOS_MAP[data.rol] || data.rol}</b> 
              {/* en{" "} */}
              {/* <b className="text-vs-ink">{TALLERES_MAP[data.sucursalId] || "—"}</b>.<br /> */}
              .El administrador del taller revisará y activará tu cuenta. Te
              avisaremos a{" "}
              <b className="text-vs-ink">{data.email || "tu correo"}</b>.
            </p>
          </div>
          <div className="bg-vs-chip rounded-2xl p-4 space-y-2 border border-vs-line-2">
            <Summary k="Nombre" v={`${data.nombre} ${data.apellido}`.trim() || "—"} />
            <Summary k="RUT" v={rut.formatted || "—"} mono />
            <Summary k="Correo" v={data.email || "—"} />
            <Summary k="Rol" v={CARGOS_MAP[data.rol] || data.rol} />
            {/* <Summary k="Sucursal" v={TALLERES_MAP[data.sucursalId] || "—"} /> */}
          </div>
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </>
      )}
    </div>
  );
}
