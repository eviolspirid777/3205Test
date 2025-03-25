export type UrlModelType = {
  id: string;
  shortUrl: string;
  originalUrl: string;
  alias?: string | null;
  expiresAt?: Date | null;
  createdAt?: Date | string;
  clickCount?: number;
  analytics?: AnalyticsModelType[];
};

export type AnalyticsModelType = {
  id: string,
  urlId: string,
  url?: UrlModelType,
  ipAddress: string,
  cratedAt: string
}