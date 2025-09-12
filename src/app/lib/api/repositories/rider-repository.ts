import { BaseRepository } from "../base-repository";
import { Rider, RiderStatus, RiderSummary } from "../../../data/types/rider";
import { PaginatedResponse } from "../../../data/types/api";
import { AvailableRiderDto } from "@/app/data/types/order";

// Zone assignment interfaces for riders
export interface RiderZoneAssignment {
  id: string;
  riderId: string;
  riderName: string;
  zoneId: string;
  zoneName: string;
  zoneDescription?: string;
  canDeliverTo: boolean;
  customDeliveryFee?: number;
  customDeliveryTime?: string; // TimeSpan as string "HH:mm:ss"
  isActive: boolean;
  assignedAt: string;
  assignedBy: string;
  assignedByName: string;
}

export interface AssignRiderToZoneRequest extends Record<string, unknown> {
  zoneId: string;
  canDeliverTo?: boolean;
  customDeliveryFee?: number;
  customDeliveryTime?: string; // TimeSpan as string "HH:mm:ss"
}

// Request DTOs to match API
export interface ApproveRiderRequest extends Record<string, unknown> {
  notes?: string;
  notifyRider?: boolean;
}

export interface SuspendRiderRequest extends Record<string, unknown> {
  reason: string;
  suspensionEndDate?: string; // ISO date string
  notifyRider?: boolean;
}

export interface RiderManagementResultDto {
  riderId: string;
  riderName: string;
  oldStatus: RiderStatus;
  newStatus: RiderStatus;
  action: string;
  actionDate: string;
  adminUser: string;
  reason?: string;
  success: boolean;
  message: string;
}

export interface RiderFilters {
  search?: string;
  status?: RiderStatus;
  isOnline?: boolean;
  page?: number;
  limit?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class RiderRepository extends BaseRepository<Rider> {
  constructor() {
    super('api/admin/riders');
  }

  async getAllRiders(filters?: RiderFilters): Promise<PaginatedResponse<RiderSummary>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() ? `/all-riders?${queryParams}` : '/all-riders';
    return this.get<PaginatedResponse<RiderSummary>>(endpoint);
  }

  /**
 * Get all riders that don't have active assignments
 */
  async getAvailableRiders(): Promise<AvailableRiderDto[]> {
    return this.get<AvailableRiderDto[]>('/available-riders');
  }

  // async getAvailableRiders(): Promise<Rider[]> {
  //   return this.get<Rider[]>('/available-riders');
  // }

  async approve(id: string, request: ApproveRiderRequest): Promise<RiderManagementResultDto> {
    return this.put<RiderManagementResultDto>(`/${id}/approve`, request);
  }

  async reject(id: string, reason: string): Promise<Rider> {
    return this.post<Rider>(`/${id}/reject`, { reason });
  }

  async suspend(id: string, request: SuspendRiderRequest): Promise<RiderManagementResultDto> {
    return this.put<RiderManagementResultDto>(`/${id}/suspend`, request);
  }

  async activate(id: string): Promise<Rider> {
    return this.put<Rider>(`/${id}/activate`, {});
  }

  async updateStatus(id: string, status: RiderStatus, notes?: string): Promise<Rider> {
    return this.put<Rider>(`/${id}/status`, { status, notes });
  }

  async getLocation(id: string): Promise<any> {
    return this.get<any>(`/${id}/location`);
  }

  async getOnlineRiders(): Promise<Rider[]> {
    return this.get<Rider[]>('/online');
  }

  async getPerformanceMetrics(id: string, dateRange?: { from: string; to: string }): Promise<any> {
    const queryParams = new URLSearchParams();

    if (dateRange) {
      queryParams.append('from', dateRange.from);
      queryParams.append('to', dateRange.to);
    }

    const endpoint = `/${id}/performance${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.get<any>(endpoint);
  }

  async getDeliveryHistory(id: string, filters?: any): Promise<any> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/${id}/deliveries${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.get<any>(endpoint);
  }

  // Zone assignment methods
  async getRiderZoneAssignments(riderId: string): Promise<RiderZoneAssignment[]> {
    return this.get<RiderZoneAssignment[]>(`/${riderId}/zones`);
  }

  async assignRiderToZone(riderId: string, request: AssignRiderToZoneRequest): Promise<RiderZoneAssignment> {
    return this.post<RiderZoneAssignment>(`/${riderId}/assign-zone`, request);
  }

  async removeRiderFromZone(riderId: string, zoneId: string): Promise<void> {
    return this.deleteRequest<void>(`/${riderId}/zones/${zoneId}`);
  }

  async sendBackToPending(riderId: string, message: string): Promise<void> {
    return this.post<void>(`/${riderId}/send-back-to-pending`, {
      message: message.trim()
    });
  }
}