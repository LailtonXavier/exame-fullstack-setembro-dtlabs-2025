import { tokenStore } from '../store/tokenStore';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }
  

  async get<T>(endpoint: string): Promise<T> {
    return this.request('GET', endpoint);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request('POST', endpoint, body);
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request('PATCH', endpoint, body);
  }  
  
  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request('PUT', endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request('DELETE', endpoint);
  }

  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const accessToken = await tokenStore.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

export const api = new ApiService();
