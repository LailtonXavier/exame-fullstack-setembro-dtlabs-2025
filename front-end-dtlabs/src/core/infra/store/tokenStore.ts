import { TokenTypes } from '@/core/domain/types/token-types';

const ACCESS_TOKEN_KEY = 'accessToken';

export const tokenStore = {
  async saveTokens({ accessToken }: TokenTypes) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};
