import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// upload-client branches on useMockServices, which reads an env var at import
// time. Force real mode here so we exercise the presign → PUT → confirm path.
vi.mock("./service-mode", () => ({ useMockServices: false }))

const post = vi.fn()
vi.mock("./http-client", () => ({ httpClient: { post: (...a: unknown[]) => post(...a) } }))

import { uploadFileToR2, isAcceptedMime } from "./upload-client"
import { ApiError } from "./api-error"

function makeFile(name = "foto.jpg", type = "image/jpeg") {
  return new File([new Uint8Array([1, 2, 3])], name, { type })
}

describe("isAcceptedMime", () => {
  it("accepts allowed types and rejects others", () => {
    expect(isAcceptedMime("image/jpeg")).toBe(true)
    expect(isAcceptedMime("application/pdf")).toBe(true)
    expect(isAcceptedMime("image/gif")).toBe(false)
  })
})

describe("uploadFileToR2", () => {
  beforeEach(() => {
    post.mockReset()
    vi.stubGlobal("fetch", vi.fn())
  })
  afterEach(() => vi.unstubAllGlobals())

  it("runs presign → raw PUT (no auth) → confirm", async () => {
    post
      .mockResolvedValueOnce({ presignedUrl: "https://r2/put", objectKey: "ordenes/1/x.jpg", publicUrl: "https://cdn/x.jpg" })
      .mockResolvedValueOnce({ id: "mm-1", url: "https://cdn/x.jpg" })
    ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true })

    const file = makeFile()
    const res = await uploadFileToR2("orden-1", file, { etapa: "ingreso" })

    // 1. presign
    expect(post).toHaveBeenNthCalledWith(1, "ordenes/orden-1/multimedia/presign", {
      tipoArchivo: "image/jpeg",
      nombre: "foto.jpg",
    })
    // 2. PUT to R2: raw fetch, correct method/Content-Type, no Authorization header
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe("https://r2/put")
    expect(init.method).toBe("PUT")
    expect(init.headers).toEqual({ "Content-Type": "image/jpeg" })
    expect(init.headers).not.toHaveProperty("Authorization")
    expect(init.body).toBe(file)
    // 3. confirm
    expect(post).toHaveBeenNthCalledWith(2, "ordenes/orden-1/multimedia/confirm", {
      objectKey: "ordenes/1/x.jpg",
      publicUrl: "https://cdn/x.jpg",
      tipoArchivo: "image/jpeg",
      etapa: "ingreso",
    })
    expect(res).toEqual({ id: "mm-1", url: "https://cdn/x.jpg" })
  })

  it("throws ApiError and skips confirm when the R2 PUT fails", async () => {
    post.mockResolvedValueOnce({ presignedUrl: "https://r2/put", objectKey: "k", publicUrl: "u" })
    ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 403,
      text: () => Promise.resolve("denied"),
    })

    await expect(uploadFileToR2("orden-1", makeFile())).rejects.toBeInstanceOf(ApiError)
    expect(post).toHaveBeenCalledTimes(1) // presign only, no confirm
  })
})
