"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react"
import { Field } from "@/components/common/Field"
import { useAdminLogin } from "@/features/auth/hooks/useAdminAuth"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { getApiErrorMessage } from "@/lib/api/api-error"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: "No encontramos una cuenta de sysadmin con ese correo electrónico.",
  INVALID_PASSWORD: "La contraseña es incorrecta. Verifica tus datos e intenta de nuevo.",
}

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const router = useRouter()
  const { mutateAsync: loginAsync, isPending } = useAdminLogin()
  const { error, setError } = useAuthStore()
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateFields()) return
    try {
      const user = await loginAsync({ email, password })
      if (user.rol === "sysadmin") {
        router.push("/admin")
      } else {
        setError("Acceso restringido a sysadmin únicamente.")
      }
    } catch (err: unknown) {
      console.error("Admin login error:", err)
      const message = getApiErrorMessage(err)
      if (message) {
        setError(message)
      } else {
        setError("Ocurrió un error inesperado. Intenta de nuevo.")
      }
    }
  }

  const validateFields = () => {
    const errors = {
      email: !email,
      password: !password,
    }
    setFieldErrors(errors)
    return !errors.email && !errors.password
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-vs-violet-bg flex items-center justify-center">
          <Shield size={16} className="text-vs-violet" />
        </div>
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight leading-none">
            Acceso Sysadmin
          </h2>
          <p className="text-[12px] text-[#8a7f70] mt-1">
            Panel exclusivo para administradores de plataforma
          </p>
        </div>
      </div>

      <div className={fieldErrors.email ? "border-red-500" : ""}>
        <Field
          icon={<Mail size={18} />}
          type="email"
          placeholder="sysadmin@veloservice.cl"
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

      <div className="text-center text-[12.5px] text-[#8a7f70] pt-2">
        ¿Eres usuario de taller?{" "}
        <a href="/login" className="text-vs-ink font-semibold hover:underline">
          Ir a login corporativo
        </a>
      </div>

      <AlertDialog open={!!error} onOpenChange={(open) => { if (!open) setError(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al iniciar sesión</AlertDialogTitle>
            <AlertDialogDescription>
              {error
                ? AUTH_ERROR_MESSAGES[error] ?? error
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
    </form>
  )
}
