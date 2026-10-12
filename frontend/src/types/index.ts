export type ServiceType =
  | 'TRASH'
  | 'LEFTOVER_FOOD'
  | 'DECORATIONS'
  | 'GIFTS_AND_STUFF'
  | 'FURNITURE_MESS'
  | 'CLEANING';

export type OccasionType =
  | 'PARTY'
  | 'HOUSE_DINNER'
  | 'BIRTHDAY'
  | 'ANNIVERSARY'
  | 'FESTIVAL'
  | 'GAME_NIGHT'
  | 'OTHER';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CREW_ASSIGNED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  savedAddresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label?: string;
  street: string;
  apartment?: string;
  landmark?: string;
  pincode: string;
  city: string;
  isDefault?: boolean;
}

export interface Package {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  basePrice: number;
  services: ServiceType[];
  minGuests: number;
  maxGuests: number;
  sortOrder: number;
}

export interface PriceEstimate {
  basePrice: number;
  guestSurcharge: number;
  rushSurcharge: number;
  taxes: number;
  total: number;
  breakdown: {
    package: string;
    guestCount: number;
    rushHour: boolean;
  };
}

export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  packageId: string;
  package?: Package;
  status: BookingStatus;
  occasion: OccasionType;
  guestCount: number;
  selectedServices: ServiceType[];
  scheduledAt: string;
  specialNotes?: string | null;
  crewPin: string;
  crewName?: string | null;
  crewContact?: string | null;
  address: Address;
  basePrice: number;
  surcharges: number;
  taxes: number;
  totalPrice: number;
  paymentStatus: string;
  checklistProgress?: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAreaCheck {
  pincode: string;
  city: string;
  isServiceable: boolean;
  tier: string;
  message: string;
}
