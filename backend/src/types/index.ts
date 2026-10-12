import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    mobile: string;
  };
}

export type ServiceKey =
  | 'TRASH'
  | 'LEFTOVER_FOOD'
  | 'DECORATIONS'
  | 'GIFTS_AND_STUFF'
  | 'FURNITURE_MESS'
  | 'CLEANING';

export type SpaceSize =
  | 'SMALL_APARTMENT'
  | 'LARGE_APARTMENT'
  | 'BUNGALOW'
  | 'VENUE'
  | 'NOT_SURE';

export type OccasionType =
  | 'BIRTHDAY'
  | 'DINNER_PARTY'
  | 'HOUSE_PARTY'
  | 'ANNIVERSARY'
  | 'FESTIVAL'
  | 'SOMETHING_ELSE';

export interface PriceBreakdown {
  basePrice: number;
  serviceAdjustment: number;
  spaceAdjustment: number;
  lateNightAdjustment: number;
  serviceFee: number;
  tax: number;
  total: number;
}
