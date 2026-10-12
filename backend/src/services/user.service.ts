import { ApiError } from '../utils/ApiError';
import { userRepository } from '../repositories/user.repository';

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  },

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return userRepository.update(userId, data);
  },
};
