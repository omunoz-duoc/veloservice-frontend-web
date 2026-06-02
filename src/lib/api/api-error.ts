export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown = null,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function getApiErrorMessage(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined
  if (!error.body || typeof error.body !== "object") return undefined
  const body = error.body as { message?: unknown }
  return typeof body.message === "string" ? body.message : undefined
}
