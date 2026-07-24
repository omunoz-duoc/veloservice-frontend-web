export const LOGO_ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"] as const
export const MAX_LOGO_FILE_BYTES = 5 * 1024 * 1024

export function validateLogoFile(file: File): string | null {
  if (!(LOGO_ACCEPTED_MIME as readonly string[]).includes(file.type)) {
    return "Usa una imagen JPG, PNG o WebP."
  }
  if (file.size > MAX_LOGO_FILE_BYTES) {
    return "El logo no puede superar los 5 MB."
  }
  return null
}
