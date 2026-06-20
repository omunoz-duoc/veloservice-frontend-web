import { getTokenExp, isTokenExpired } from "./jwt"

function makeJwt(payload: object): string {
  const json = JSON.stringify(payload)
  const b64 = btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  return `eyJhbGciOiJIUzI1NiJ9.${b64}.fakesig`
}

const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3600
const PAST_EXP   = Math.floor(Date.now() / 1000) - 3600

describe("getTokenExp", () => {
  it("returns exp number from a valid JWT", () => {
    expect(getTokenExp(makeJwt({ exp: FUTURE_EXP }))).toBe(FUTURE_EXP)
  })

  it("returns null when exp claim is absent", () => {
    expect(getTokenExp(makeJwt({ sub: "user" }))).toBeNull()
  })

  it("returns null for a malformed base64 payload", () => {
    expect(getTokenExp("header.!!!.sig")).toBeNull()
  })

  it("returns null for a non-JWT string with no dots", () => {
    expect(getTokenExp("notajwt")).toBeNull()
  })

  it("returns null when payload is valid base64 but not JSON", () => {
    const b64 = btoa("not-json").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
    expect(getTokenExp(`h.${b64}.s`)).toBeNull()
  })
})

describe("isTokenExpired", () => {
  it("returns true for null", () => {
    expect(isTokenExpired(null)).toBe(true)
  })

  it("returns true for undefined", () => {
    expect(isTokenExpired(undefined)).toBe(true)
  })

  it("returns true for empty string", () => {
    expect(isTokenExpired("")).toBe(true)
  })

  it("returns true when token has no exp claim", () => {
    expect(isTokenExpired(makeJwt({ sub: "user" }))).toBe(true)
  })

  it("returns true for a malformed token", () => {
    expect(isTokenExpired("not.a.jwt")).toBe(true)
  })

  it("returns true for an expired token", () => {
    expect(isTokenExpired(makeJwt({ exp: PAST_EXP }))).toBe(true)
  })

  it("returns false for a valid future token", () => {
    expect(isTokenExpired(makeJwt({ exp: FUTURE_EXP }))).toBe(false)
  })

  it("returns true at the exact expiry boundary (exp * 1000 === Date.now())", () => {
    const nowMs = 1_700_000_000_000
    vi.spyOn(Date, "now").mockReturnValue(nowMs)
    const exp = nowMs / 1000
    expect(isTokenExpired(makeJwt({ exp }))).toBe(true)
    vi.restoreAllMocks()
  })
})
