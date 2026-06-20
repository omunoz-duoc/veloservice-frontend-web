import { ApiError, getApiErrorMessage } from "./api-error"

describe("ApiError", () => {
  it("is an instance of Error", () => {
    expect(new ApiError("oops", 400)).toBeInstanceOf(Error)
  })

  it("has name 'ApiError'", () => {
    expect(new ApiError("oops", 400).name).toBe("ApiError")
  })

  it("exposes the status code", () => {
    expect(new ApiError("oops", 404).status).toBe(404)
  })

  it("exposes the body", () => {
    const body = { message: "Not found" }
    expect(new ApiError("oops", 404, body).body).toEqual(body)
  })

  it("defaults body to null when not provided", () => {
    expect(new ApiError("oops", 500).body).toBeNull()
  })
})

describe("getApiErrorMessage", () => {
  it("returns undefined for a non-Error value", () => {
    expect(getApiErrorMessage("string error")).toBeUndefined()
  })

  it("returns undefined for a plain Error", () => {
    expect(getApiErrorMessage(new Error("plain"))).toBeUndefined()
  })

  it("returns undefined when ApiError body is null", () => {
    expect(getApiErrorMessage(new ApiError("x", 500))).toBeUndefined()
  })

  it("returns undefined when ApiError body is a string", () => {
    expect(getApiErrorMessage(new ApiError("x", 500, "raw string"))).toBeUndefined()
  })

  it("returns undefined when body.message is not a string", () => {
    expect(getApiErrorMessage(new ApiError("x", 422, { message: 42 }))).toBeUndefined()
  })

  it("returns body.message when it is a string", () => {
    const err = new ApiError("x", 409, { message: "RUT already exists" })
    expect(getApiErrorMessage(err)).toBe("RUT already exists")
  })
})
