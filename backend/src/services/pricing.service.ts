import { PriceBreakdown, ServiceKey, SpaceSize } from '../types';

// All prices in INR (not paise, for readability)
const BASE_PRICES: Record<string, number> = {
  QUICK_RESET: 1499,
  CUSTOM_RESET: 1999,
  FULL_RESET: 2999,
};

const SPACE_MULTIPLIERS: Record<SpaceSize, number> = {
  SMALL_APARTMENT: 1.0,
  LARGE_APARTMENT: 1.3,
  BUNGALOW: 1.6,
  VENUE: 2.2,
  NOT_SURE: 1.2,
};

const SERVICE_ADD_ONS: Record<ServiceKey, number> = {
  TRASH: 0,           // included in all packages
  LEFTOVER_FOOD: 149,
  DECORATIONS: 199,
  GIFTS_AND_STUFF: 99,
  FURNITURE_MESS: 249,
  CLEANING: 299,
};

// Late-night surcharge applies after 11 PM
const LATE_NIGHT_SURCHARGE = 299;

export const pricingService = {
  calculate(params: {
    packageName: string;
    selectedServices: ServiceKey[];
    spaceSize: SpaceSize;
    scheduledTime?: string; // "HH:MM"
    guestCount?: number;
  }): PriceBreakdown {
    const basePrice = BASE_PRICES[params.packageName] ?? BASE_PRICES.QUICK_RESET;

    // Space adjustment
    const spaceMultiplier = SPACE_MULTIPLIERS[params.spaceSize] ?? 1.0;
    const spaceAdjustment = Math.round(basePrice * (spaceMultiplier - 1));

    // Service add-ons (only for CUSTOM_RESET, where user picks services)
    let serviceAdjustment = 0;
    if (params.packageName === 'CUSTOM_RESET') {
      serviceAdjustment = params.selectedServices.reduce(
        (sum, key) => sum + (SERVICE_ADD_ONS[key] ?? 0),
        0
      );
    }

    // Late night surcharge
    let lateNightAdjustment = 0;
    if (params.scheduledTime) {
      const [hourStr] = params.scheduledTime.split(':');
      const hour = parseInt(hourStr, 10);
      if (hour >= 23 || hour < 6) {
        lateNightAdjustment = LATE_NIGHT_SURCHARGE;
      }
    }

    const subtotal = basePrice + spaceAdjustment + serviceAdjustment + lateNightAdjustment;
    const serviceFee = Math.round(subtotal * 0.05); // 5% platform fee
    const tax = Math.round((subtotal + serviceFee) * 0.18); // 18% GST
    const total = subtotal + serviceFee + tax;

    return {
      basePrice,
      serviceAdjustment,
      spaceAdjustment,
      lateNightAdjustment,
      serviceFee,
      tax,
      total,
    };
  },
};
