import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ApiError } from "@/lib/api/api-error"

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}))

vi.mock("@/lib/api/http-client", () => ({
  httpClient: mocks,
}))

import { configuracionRealService } from "./configuracion.service"

const TALLER_SCOPE = { attachSucursal: false }

describe("configuracionRealService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("loads workshop-wide data and maps nullable fields", async () => {
    mocks.get.mockResolvedValue({
      nombre: "VeloService",
      rut: "76.845.210-3",
      telefono: null,
      email: null,
      logoUrl: null,
    })

    await expect(configuracionRealService.getPerfilNegocio()).resolves.toEqual({
      nombre: "VeloService",
      rut: "76.845.210-3",
      telefono: "",
      email: "",
      logoUrl: null,
    })
    expect(mocks.get).toHaveBeenCalledWith("configuracion/taller", TALLER_SCOPE)
  })

  it("sends cleared optional workshop and branch fields as null", async () => {
    mocks.patch
      .mockResolvedValueOnce({
        nombre: "VeloService",
        rut: "76.845.210-3",
        telefono: null,
        email: null,
        logoUrl: null,
      })
      .mockResolvedValueOnce({
        id: "s-1",
        nombre: "Centro",
        direccion: null,
        telefono: null,
        email: null,
      })

    await configuracionRealService.guardarPerfilNegocio({
      nombre: "VeloService",
      rut: "76.845.210-3",
      telefono: "",
      email: "",
    })
    await configuracionRealService.guardarSucursal("s-1", {
      nombre: "Centro",
      direccion: "",
      telefono: "",
      email: "",
    })

    expect(mocks.patch).toHaveBeenNthCalledWith(
      1,
      "configuracion/taller",
      {
        nombre: "VeloService",
        rut: "76.845.210-3",
        telefono: null,
        email: null,
      },
      TALLER_SCOPE
    )
    expect(mocks.patch).toHaveBeenNthCalledWith(
      2,
      "configuracion/sucursales/s-1",
      {
        nombre: "Centro",
        direccion: null,
        telefono: null,
        email: null,
      },
      TALLER_SCOPE
    )
  })

  it("uploads a logo using presign, raw PUT, and confirm", async () => {
    mocks.post
      .mockResolvedValueOnce({
        presignedUrl: "https://r2/put",
        objectKey: "talleres/t-1/logo/x.png",
        publicUrl: "https://cdn/logo.png",
      })
      .mockResolvedValueOnce({
        nombre: "VeloService",
        rut: "76.845.210-3",
        telefono: null,
        email: null,
        logoUrl: "https://cdn/logo.png",
      })
    ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true })

    const file = new File(["logo"], "logo.png", { type: "image/png" })
    const result = await configuracionRealService.subirLogo(file)

    expect(mocks.post).toHaveBeenNthCalledWith(
      1,
      "configuracion/taller/logo/presign",
      { tipoArchivo: "image/png", nombre: "logo.png" },
      TALLER_SCOPE
    )
    expect(fetch).toHaveBeenCalledWith("https://r2/put", {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: file,
    })
    expect(mocks.post).toHaveBeenNthCalledWith(
      2,
      "configuracion/taller/logo/confirm",
      {
        objectKey: "talleres/t-1/logo/x.png",
        publicUrl: "https://cdn/logo.png",
        tipoArchivo: "image/png",
      },
      TALLER_SCOPE
    )
    expect(result.logoUrl).toBe("https://cdn/logo.png")
  })

  it("does not confirm when the direct R2 upload fails", async () => {
    mocks.post.mockResolvedValueOnce({
      presignedUrl: "https://r2/put",
      objectKey: "key",
      publicUrl: "url",
    })
    ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 403,
      text: () => Promise.resolve("denied"),
    })

    const file = new File(["logo"], "logo.png", { type: "image/png" })
    await expect(configuracionRealService.subirLogo(file)).rejects.toBeInstanceOf(ApiError)
    expect(mocks.post).toHaveBeenCalledTimes(1)
  })
})
