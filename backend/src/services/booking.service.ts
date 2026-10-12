import { ApiError } from '../utils/ApiError';
import { bookingRepository } from '../repositories/booking.repository';
import { packageRepository } from '../repositories/package.repository';
import { serviceAreaRepository } from '../repositories/serviceArea.repository';
import { pricingService } from './pricing.service';
import { availabilityService } from './availability.service';
import { ServiceKey, SpaceSize } from '../types';

export const bookingService = {
  async createDraft(userId: string) {
    return bookingRepository.create(userId);
  },

  async getById(id: string, userId: string) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (booking.userId !== userId) throw new ApiError(403, 'Not your booking');
    return booking;
  },

  async getUserBookings(userId: string) {
    return bookingRepository.findByUserId(userId);
  },

  async updateDraft(
    id: string,
    userId: string,
    data: {
      occasion?: string;
      guestCount?: number;
      selectedServices?: ServiceKey[];
      spaceSize?: SpaceSize;
      packageId?: string;
      scheduledDate?: string;
      scheduledTime?: string;
      address?: string;
      flatNumber?: string;
      building?: string;
      landmark?: string;
      pincode?: string;
      latitude?: number;
      longitude?: number;
      accessInstructions?: string;
      foodPackingNotes?: string;
      pets?: string;
      doNotTouchItems?: string[];
      otherNotes?: string;
    }
  ) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (booking.userId !== userId) throw new ApiError(403, 'Not your booking');

    const updateData: Parameters<typeof bookingRepository.update>[1] = {
      ...data,
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
    };

    // If we have enough info, recalculate price
    const pkg = data.packageId
      ? await packageRepository.findById(data.packageId)
      : booking.package;

    const spaceSize = (data.spaceSize ?? booking.spaceSize) as SpaceSize | null;
    const services = (data.selectedServices ?? booking.selectedServices) as ServiceKey[];

    if (pkg && spaceSize) {
      const breakdown = pricingService.calculate({
        packageName: pkg.name,
        selectedServices: services,
        spaceSize,
        scheduledTime: data.scheduledTime ?? booking.scheduledTime ?? undefined,
      });
      Object.assign(updateData, {
        basePrice: breakdown.basePrice,
        serviceAdjustment: breakdown.serviceAdjustment,
        spaceAdjustment: breakdown.spaceAdjustment,
        lateNightAdjustment: breakdown.lateNightAdjustment,
        serviceFee: breakdown.serviceFee,
        tax: breakdown.tax,
        total: breakdown.total,
      });
    }

    return bookingRepository.update(id, updateData);
  },

  async recommendPackage(params: {
    selectedServices: ServiceKey[];
    guestCount: number;
    spaceSize: SpaceSize;
  }) {
    const { selectedServices, guestCount, spaceSize } = params;
    const allPackages = await packageRepository.findAll();

    let recommendedName = 'QUICK_RESET';

    const allServices: ServiceKey[] = [
      'TRASH', 'LEFTOVER_FOOD', 'DECORATIONS', 'GIFTS_AND_STUFF', 'FURNITURE_MESS', 'CLEANING',
    ];
    const selectedAll = allServices.every((s) => selectedServices.includes(s));

    if (selectedAll || selectedServices.length >= 5) {
      recommendedName = 'FULL_RESET';
    } else if (selectedServices.length >= 3 || guestCount > 30) {
      recommendedName = 'CUSTOM_RESET';
    }

    const recommended = allPackages.find((p) => p.name === recommendedName) ?? allPackages[0];

    const breakdown = pricingService.calculate({
      packageName: recommended.name,
      selectedServices,
      spaceSize,
    });

    return { recommended, breakdown, allPackages };
  },

  async checkAndHoldSlot(bookingId: string, userId: string) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (booking.userId !== userId) throw new ApiError(403, 'Not your booking');
    if (!booking.scheduledDate || !booking.scheduledTime) {
      throw new ApiError(400, 'Schedule not set');
    }

    const availability = await availabilityService.checkSlot(
      new Date(booking.scheduledDate),
      booking.scheduledTime
    );

    if (!availability.available) {
      const nextSlots = await availabilityService.getNextAvailableSlots(
        new Date(booking.scheduledDate)
      );
      throw new ApiError(409, 'TIME_SLOT_TAKEN', nextSlots.map((s) => `${s.date} ${s.time}`));
    }

    // Hold slot for 10 minutes
    const slotHeldUntil = new Date(Date.now() + 10 * 60 * 1000);
    return bookingRepository.update(bookingId, {
      status: 'SLOT_HELD',
      slotHeldUntil,
    });
  },

  async confirmBooking(bookingId: string, userId: string) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (booking.userId !== userId) throw new ApiError(403, 'Not your booking');

    // In prototype, mock payment success
    // Re-check slot is still held
    if (booking.slotHeldUntil && new Date() > booking.slotHeldUntil) {
      throw new ApiError(409, 'Slot hold expired. Please reschedule.');
    }

    const arrivalPin = Math.floor(1000 + Math.random() * 9000).toString();

    return bookingRepository.update(bookingId, {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      arrivalPin,
    });
  },

  async updateStatus(bookingId: string, userId: string, status: string) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (booking.userId !== userId) throw new ApiError(403, 'Not your booking');

    const validStatuses = [
      'CONFIRMED', 'CREW_ASSIGNED', 'CREW_ON_THE_WAY',
      'CREW_ARRIVED', 'RESET_IN_PROGRESS', 'COMPLETED',
    ];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status transition');
    }

    return bookingRepository.update(bookingId, { status: status as never });
  },

  async submitRating(bookingId: string, userId: string, score: number, label: string, feedback?: string) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (booking.userId !== userId) throw new ApiError(403, 'Not your booking');
    if (booking.status !== 'COMPLETED') throw new ApiError(400, 'Booking not completed yet');

    const existing = await bookingRepository.findRatingByBookingId(bookingId);
    if (existing) throw new ApiError(409, 'Rating already submitted');

    return bookingRepository.createRating({ bookingId, userId, score, label, feedback });
  },
};
