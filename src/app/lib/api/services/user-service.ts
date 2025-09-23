import { BaseRepository } from "../base-repository";
import { User } from "../../../data/types/application-user";
import { 
  RoleSwitchRequest, 
  RoleSwitchResponse, 
  UserForRoleSwitch,
  UserSummaryDto,
  GetAllUsersRequest
} from "../../../data/types/vendor";
import { PaginatedResponse } from "../../../data/types/api";

export class UserService extends BaseRepository<User> {
  constructor() {
    super('/api/admin/users');
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
    } catch {
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

  // Get all users with filtering and pagination
  async getAllUsers(filters?: GetAllUsersRequest): Promise<PaginatedResponse<UserSummaryDto>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : '';
    
    return this.get<PaginatedResponse<UserSummaryDto>>(url);
  }

  // Search users for role switching (converts UserSummaryDto to UserForRoleSwitch)
  async searchUsers(query: string): Promise<UserForRoleSwitch[]> {
    const response = await this.getAllUsers({
      search: query,
      pageSize: 20,
      sortBy: 'firstName',
      sortOrder: 'asc'
    });
    
    // Convert UserSummaryDto to UserForRoleSwitch format
    return response.items.map(user => ({
      userId: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
      currentRole: user.role as any, // Type assertion since we know it's a valid role
      status: user.status,
      hasActiveOrders: user.hasActiveOrders,
      hasActiveDeliveries: user.hasActiveDeliveries
    }));
  }

  // Role switching functionality
  async switchUserRole(userId: string, request: RoleSwitchRequest): Promise<RoleSwitchResponse> {
    return this.put<RoleSwitchResponse>(`/${userId}/switch-role`, request);
  }
}

// Export singleton instance
export const userService = new UserService();