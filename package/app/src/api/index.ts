import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useUserStore } from 'src/stores/user';
import User from './User';
export class ApiError extends Error {
  constructor(public readonly statusCode: number, message?: string) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function getData<T>(response: AxiosResponse<T>): T {
  return response.data;
}

export const Api = {
  client(path = '', requireToken = true): AxiosInstance {
    const user = useUserStore();
    const token = user.token;
    if (requireToken && token === null) {
      throw new Error('Unauthorized request');
    }
    const client = axios.create({
      baseURL: `${process.env.API_BASE_URL}${path}`,
      // 10 seconds
      timeout: 1000 * 10,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : { 'Content-Type': 'application/json' },
    });
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof AxiosError) {
          if (
            typeof error.response?.data?.message === 'string' &&
            !!error.response?.data.statusCode
          ) {
            return Promise.reject(
              new ApiError(
                error.response?.data.statusCode,
                error.response.data.message
              )
            );
          }
          return Promise.reject(new Error('Unhandled API error'));
        }
        return Promise.reject(error);
      }
    );
    return client;
  },
  User,
};
