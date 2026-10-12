import { serviceAreaRepository } from '../repositories/serviceArea.repository';

export const serviceAreaService = {
  async check(pincode: string): Promise<{ serviceable: boolean; city?: string; state?: string }> {
    const area = await serviceAreaRepository.findByPincode(pincode.trim());
    if (!area || !area.active) return { serviceable: false };
    return { serviceable: true, city: area.city, state: area.state };
  },
};
