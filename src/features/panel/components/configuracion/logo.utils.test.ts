import { describe, expect, it } from "vitest"
import { MAX_LOGO_FILE_BYTES, validateLogoFile } from "./logo.utils"

describe("validateLogoFile", () => {
  it("accepts supported image formats within the size limit", () => {
    const file = new File(["logo"], "logo.webp", { type: "image/webp" })
    expect(validateLogoFile(file)).toBeNull()
  })

  it("rejects unsupported types and files larger than 5 MiB", () => {
    const gif = new File(["logo"], "logo.gif", { type: "image/gif" })
    const large = new File([new Uint8Array(MAX_LOGO_FILE_BYTES + 1)], "logo.png", {
      type: "image/png",
    })

    expect(validateLogoFile(gif)).toMatch(/JPG, PNG o WebP/)
    expect(validateLogoFile(large)).toMatch(/5 MB/)
  })
})
