export type ShortenRequestBody = {
  originalUrl: string,
  expiresAt: Date,
  alias: string
}