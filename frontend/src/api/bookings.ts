import { apiClient } from './client';
import type { PackageItem } from './packages';

export interface BookingResponse {
  id: string;
  userId: string;
  occasion?: string;
  guestCount?: number;
  selectedServices: string[];
  spaceSize?: string;
  packageId?: string;
  package?: PackageItem;
  scheduledDate?: string;
  scheduledTime?: string;
  address?: string;
  flatNumber?: string;
  building?: string;
  landmark?: string;
  pincode?: string;
  accessInstructions?: string;
  foodPackingNotes?: string;
  pets?: string;
  doNotTouchItems?: string[];
  otherNotes?: string;
  basePrice?: number;
  serviceAdjustment?: number;
  spaceAdjustment?: number;
  lateNightAdjustment?: number;
  serviceFee?: number;
  tax?: number;
  total?: number;
  status: string;
  paymentStatus: string;
  slotHeldUntil?: string;
  crewId?: string;
  arrivalPin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationResponse {
  recommended: PackageItem;
  breakdown: {
    basePrice: number;
    guestSurcharge: number;
    rushSurcharge: number;
    taxes: number;
    total: number;
  };
  allPackages: PackageItem[];
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
}

export const bookingsApi = {
  createDraft: () =>
    apiClient<BookingResponse>('/bookings', {
      method: 'POST',
    }),

  getAll: () =>
    apiClient<BookingResponse[]>('/bookings'),

  getById: (id: string) =>
    apiClient<BookingResponse>(`/bookings/${id}`),

  updateDraft: (id: string, data: Partial<BookingResponse>) =>
    apiClient<BookingResponse>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  checkAvailability: (date: string) =>
    apiClient<{ date: string; slots: AvailabilitySlot[] }>(`/bookings/availability?date=${date}`),

  recommend: (data: { selectedServices: string[]; guestCount: number; spaceSize: string }) =>
    apiClient<RecommendationResponse>('/bookings/recommend', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  holdSlot: (id: string) =>
    apiClient<BookingResponse>(`/bookings/${id}/hold`, {
      method: 'POST',
    }),

  confirm: (id: string) =>
    apiClient<BookingResponse>(`/bookings/${id}/confirm`, {
      method: 'POST',
    }),

  updateStatus: (id: string, status: string) =>
    apiClient<BookingResponse>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  rate: (id: string, data: { score: number; label: string; feedback?: string }) =>
    apiClient<unknown>(`/bookings/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
