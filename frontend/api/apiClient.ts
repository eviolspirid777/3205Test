import axios, { type AxiosInstance } from "axios";
import { DeleteAddressResponse, GetAnalyticResponse, getUrlsType, PostAddressRequest, PostAddressResponse } from "../types/ApiClientTypes";

const BASE_URL_PATH = "http://localhost:3001";

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
    });
  }

  async postAddress (data: PostAddressRequest) {
    const response = await this.client.post<PostAddressResponse>(`${BASE_URL_PATH}/shorten`, data);
    return response;
  }

  async getAddressInformation (shortUrl: string) {
    const response = await this.client.get<string>(`${BASE_URL_PATH}/info/${shortUrl}`);
    return response;
  }

  async deleteAddressInformation (shortUrl: string) {
    const response = await this.client.delete<DeleteAddressResponse>(`${BASE_URL_PATH}/info/${shortUrl}`);
    return response;
  }

  async getAnalytics(shortUrl: string) {
    const response = await this.client.get<GetAnalyticResponse>(`${BASE_URL_PATH}/analytics/${shortUrl}`);
    return response;
  }

  async getShortUrl(shortUrl: string) {
    const response = await this.client.get(`${BASE_URL_PATH}/${shortUrl}`);
    return response;
  }

  async getUrls(limit: number, page: number) {
    const response = await this.client.get<getUrlsType>(`${BASE_URL_PATH}/urls`, {
      params: {
        page,
        limit,
      }
    });
    return response;
  }
}

export const apiClient = new ApiClient();