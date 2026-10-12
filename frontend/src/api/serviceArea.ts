import { apiClient } from './client';

export interface ServiceAreaResult {
  pincode: string;
  isServiceable: boolean;
  areaName?: string;
  city?: string;
  message?: string;
}

export interface ServiceAreaRecord {
  id: string;
  pincode: string;
  city: string;
  areaName: string;
  isActive: boolean;
  estimatedLeadTimeMinutes: number;
}

export const serviceAreaApi = {
  checkPincode: (pincode: string) =>
    apiClient<ServiceAreaResult>(`/service-areas/check/${pincode}`),

  getAllAreas: () =>
    apiClient<ServiceAreaRecord[]>('/service-areas'),
};
