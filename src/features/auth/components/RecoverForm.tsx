"use client";

import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Field } from "@/components/common/Field";
import { useRecoverPassword } from "@/features/auth/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecoverFormProps {
  onBack: () => void;
}

export function RecoverForm({ onBack }: RecoverFormProps) {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<{ ok: boolean; message: string } | null>(null);

  const { mutate: sendCode, isPending: isSending } = useRecoverPassword();

  function handleSubmit() {
    sendCode(email, {
      onSuccess: () =>
        setAlert({
          ok: true,
          message: `Te enviamos un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`,
        }),
      onError: () =>
        setAlert({
          ok: false,
          message: "No pudimos enviar el correo de recuperación. Verifica que el correo esté registrado e intenta nuevamente.",
        }),
    });
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] text-[#8a7f70] hover:text-vs-ink transition-colors"
      >
        <ArrowLeft size={16} /> Volver al inicio de sesión
      </button>

      <div>
        <h2 className="text-[26px] font-semibold tracking-tight">
          Recuperar contraseña
        </h2>
        <p className="text-[13px] text-[#8a7f70] mt-1">
          Te enviaremos un enlace de recuperación al correo asociado a tu cuenta.
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
        onClick={handleSubmit}
        disabled={isSending || !email}
        className="w-full flex items-center justify-center gap-2 bg-vs-ink text-white py-3 rounded-full text-[13.5px] font-semibold hover:bg-black transition-colors disabled:opacity-60"
      >
        {isSending ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Enviar solicitud"
        )}
      </button>

      <AlertDialog open={!!alert} onOpenChange={(open) => { if (!open) setAlert(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alert?.ok ? "Correo enviado" : "Error al enviar correo"}
            </AlertDialogTitle>
            <AlertDialogDescription>{alert?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => { setAlert(null); if (alert?.ok) onBack(); }}>
              {alert?.ok ? "Ir al inicio de sesión" : "Entendido"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
