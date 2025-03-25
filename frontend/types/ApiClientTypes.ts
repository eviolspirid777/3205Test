export type PostAddressRequest = {
  originalUrl: string,
  expiresAt: string,
  alias: string
}

export type PostAddressResponse = {
  shortUrl: string
}

export type DeleteAddressResponse = {
  message: string
}

export type GetAnalyticResponse = {
  clickCount: number,
  lastIps: string[]
}

export type getUrlsType = {
  total: number,
  data: {
    key: number,
    shortUrl: string,
    originalUrl: string, 
    alias: string,
    expiresAt: moment.Moment,
  }[]
}

export type UrlType = {
  id: string,
  shortUrl: string,
  originalUrl: string,
  alias?: string,
  expiresAt?: string,
  createdAt?: string,
  clickCount?: string,
  analytics?: AnalyticsType[]
}

export type AnalyticsType = {
  id: string,
  urlId: string,
  url?: UrlType,
  ipAddress: string,
  cratedAt: string
}