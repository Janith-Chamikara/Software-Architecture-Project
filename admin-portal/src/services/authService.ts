import axiosClient from '../api/axiosClient';
import type { AuthResponse } from '../models/auth';

export const authService = {
  login: async (phoneNumber: string, password: string): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/sign-in', {
      phoneNumber,
      password,
    });
    return response.data;
  },
};
