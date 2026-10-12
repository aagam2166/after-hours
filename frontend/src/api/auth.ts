import { apiClient } from './client';

export interface SendOtpResponse {
  message: string;
  mockCode?: string;
}

export interface VerifyOtpResponse {
  token: string;
  isNewUser: boolean;
}

export interface UserProfile {
  id: string;
  mobile: string;
  name: string | null;
  email: string | null;
  verified: boolean;
  createdAt: string;
}

export const authApi = {
  sendOtp: (mobile: string) =>
    apiClient<SendOtpResponse>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    }),

  verifyOtp: (mobile: string, code: string) =>
    apiClient<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, code }),
    }),

  getMe: () => apiClient<UserProfile>('/users/me'),

  updateMe: (data: { name?: string; email?: string }) =>
    apiClient<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
