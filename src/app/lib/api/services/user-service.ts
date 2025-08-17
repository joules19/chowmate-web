import { BaseRepository } from "../base-repository";
import { User } from "../../../data/types/entities";

export class UserService extends BaseRepository<User> {
  constructor() {
    super('/api/users');
  }

  // Custom methods specific to users
  async suspendUser(userId: string): Promise<void> {
    return this.post<void>(`/${userId}/suspend`);
  }

  async activateUser(userId: string): Promise<void> {
    return this.post<void>(`/${userId}/activate`);
  }

  async updateUserRole(userId: string, roleId: string): Promise<User> {
    return this.put<User>(`/${userId}/role`, { roleId });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.get<User>(`/email/${encodeURIComponent(email)}`);
    } catch (error) {
      // If user not found, return null instead of throwing
      return null;
    }
  }

  async bulkSuspendUsers(userIds: string[]): Promise<void> {
    return this.bulkAction('suspend', userIds);
  }

  async bulkActivateUsers(userIds: string[]): Promise<void> {
    return this.bulkAction('activate', userIds);
  }
}

// Export singleton instance
export const userService = new UserService();