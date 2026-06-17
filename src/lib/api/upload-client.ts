/**
 * Multimedia upload via Cloudflare R2 presigned URLs (web).
 *
 * Web port of veloservice-mobile/src/lib/api/upload-client.ts. Flow:
 *   1. POST ordenes/{id}/multimedia/presign  → short-lived R2 PUT URL
 *   2. PUT the File straight to R2 (presigned URL self-authenticates, no Bearer)
 *   3. POST ordenes/{id}/multimedia/confirm  → backend records the DB row
 *
 * The PUT in step 2 uses raw fetch — NOT httpClient — because httpClient
 * prepends the API base URL, attaches the Authorization header, and injects
 * sucursalId, all of which the presigned URL rejects.
 */
import { httpClient } from "./http-client"
import { ApiError } from "./api-error"
import { useMockServices } from "./service-mode"

/** MIME types the backend accepts (OrdenService.validarMimePermitido). */
export const ACCEPTED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
] as const

/** Max upload size in bytes, mirroring backend maxSizeParaMime. */
export const MAX_FILE_BYTES = 50 * 1024 * 1024 // 50 MB

type PresignResponse = {
  presignedUrl: string
  objectKey: string
  publicUrl: string
}

/** Full multimedia row returned by the confirm endpoint. */
export type MultimediaRecord = {
  id: string
  usuarioId: string
  usuario: string
  tipoArchivo: string
  categoria: string
  url: string
  etapa?: string
  descripcion?: string
  createdAt: string
}

export function isAcceptedMime(mime: string): boolean {
  return (ACCEPTED_MIME as readonly string[]).includes(mime)
}

export async function uploadFileToR2(
  ordenId: string,
  file: File,
  fields: { etapa?: string; descripcion?: string } = {},
): Promise<MultimediaRecord> {
  // Mock mode: never touch R2. Return a stub row.
  if (useMockServices) {
    return {
      id: `mm-${Date.now()}`,
      usuarioId: "mock-user",
      usuario: "Mock User",
      tipoArchivo: file.type,
      categoria: file.type.startsWith("image/") ? "imagen" : file.type.startsWith("video/") ? "video" : "documento",
      url: `https://mock.r2/${ordenId}/${file.name}`,
      etapa: fields.etapa,
      descripcion: fields.descripcion,
      createdAt: new Date().toISOString(),
    }
  }

  const tipoArchivo = file.type

  // 1. Ask backend for a presigned R2 PUT URL.
  const { presignedUrl, objectKey, publicUrl } = await httpClient.post<PresignResponse>(
    `ordenes/${ordenId}/multimedia/presign`,
    { tipoArchivo, nombre: file.name },
  )

  // 2. PUT binary straight to R2. Raw fetch, no auth header — presigned URL is self-signed.
  const put = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": tipoArchivo },
    body: file,
  })
  if (!put.ok) {
    throw new ApiError("R2 upload failed", put.status, await put.text().catch(() => null))
  }

  // 3. Confirm — backend inserts the multimedia record and returns it.
  return httpClient.post<MultimediaRecord>(`ordenes/${ordenId}/multimedia/confirm`, {
    objectKey,
    publicUrl,
    tipoArchivo,
    ...fields,
  })
}
