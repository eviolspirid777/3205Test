export type UrlModelType = {
  id: string,
  shortUrl: string,
  originalUrl: string,
  alias?: string,
  expiresAt?: string,
  createdAt?: string,
  clickCount?: string,
  analytics?: AnalyticsModelType[]
}

export type AnalyticsModelType = {
  id: string,
  urlId: string,
  url?: UrlModelType,
  ipAddress: string,
  cratedAt: string
}