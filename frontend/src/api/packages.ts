import { apiClient } from './client';

export interface PackageItem {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  basePrice: number;
  services: string[];
  minGuests: number;
  maxGuests: number;
  sortOrder: number;
}

export const packagesApi = {
  getAll: () => apiClient<PackageItem[]>('/packages'),
  getById: (id: string) => apiClient<PackageItem>(`/packages/${id}`),
};
