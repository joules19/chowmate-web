import {
  Vendor,
  VendorFilters,
  VendorSummary,
  VendorDetails,
  ApproveVendorRequest,
  RejectVendorRequest,
  SuspendVendorRequest,
  ActivateVendorRequest,
  UpdateVendorStatusRequest,
  VendorZoneAssignment,
  AssignVendorToZoneRequest,
  SendInstructionRequest,
  VendorStats
} from '@/app/data/types/vendor';
import { BaseRepository } from '../base-repository';
import { PaginatedResponse } from '@/app/data/types/api';
import { Zone } from '@/app/data/types/location';

// Define activity log type
interface ActivityLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  performedBy: string;
  performedAt: string;
  metadata?: Record<string, unknown>;
}

export class VendorRepository extends BaseRepository<Vendor> {
  constructor() {
    super('api/admin/vendors');
  }

  async getAllVendors(filters?: VendorFilters): Promise<PaginatedResponse<VendorSummary>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() ? `?${queryParams}` : '';
    return this.get<PaginatedResponse<VendorSummary>>(endpoint);
  }

  async getVendorById(vendorId: string): Promise<VendorDetails> {
    return this.get<VendorDetails>(`/${vendorId}`);
  }

  async approveVendor(vendorId: string, request: ApproveVendorRequest): Promise<Vendor> {
    return this.put<Vendor>(`/${vendorId}/approve`, request);
  }

  async rejectVendor(vendorId: string, request: RejectVendorRequest): Promise<Vendor> {
    return this.put<Vendor>(`/${vendorId}/reject`, request);
  }

  async suspendVendor(vendorId: string, request: SuspendVendorRequest): Promise<Vendor> {
    return this.put<Vendor>(`/${vendorId}/suspend`, request);
  }

  async activateVendor(vendorId: string, request: ActivateVendorRequest): Promise<Vendor> {
    return this.put<Vendor>(`/${vendorId}/activate`, request);
  }

  async updateVendorStatus(vendorId: string, request: UpdateVendorStatusRequest): Promise<Vendor> {
    return this.put<Vendor>(`/${vendorId}/status`, request);
  }

  async getVendorZoneAssignments(vendorId: string): Promise<VendorZoneAssignment[]> {
    return this.get<VendorZoneAssignment[]>(`/${vendorId}/zones`);
  }

  async getAvailableZones(): Promise<Zone[]> {
    return this.get<Zone[]>('/zones/available');
  }

  async assignVendorToZone(vendorId: string, request: AssignVendorToZoneRequest): Promise<VendorZoneAssignment> {
    return this.post<VendorZoneAssignment>(`/${vendorId}/assign-zone`, request);
  }

  async removeVendorFromZone(vendorId: string, zoneId: string): Promise<void> {
    return this.deleteRequest<void>(`/${vendorId}/zones/${zoneId}`);
  }

  async sendInstruction(vendorId: string, request: SendInstructionRequest): Promise<void> {
    return this.post<void>(`/${vendorId}/instructions`, request);
  }

  async getVendorStats(dateFrom?: string, dateTo?: string): Promise<VendorStats> {
    const queryParams = new URLSearchParams();

    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);

    const endpoint = `/stats${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.get<VendorStats>(endpoint);
  }

  async getVendorActivities(vendorId: string, limit: number = 20): Promise<ActivityLog[]> {
    return this.get<ActivityLog[]>(`/${vendorId}/activities?limit=${limit}`);
  }

  // Convenience methods for common actions
  async bulkApprove(vendorIds: string[], reason?: string): Promise<void> {
    return this.bulkAction('approve', vendorIds, { reason });
  }

  async bulkReject(vendorIds: string[], reason: string): Promise<void> {
    return this.bulkAction('reject', vendorIds, { reason });
  }

  async bulkSuspend(vendorIds: string[], reason: string): Promise<void> {
    return this.bulkAction('suspend', vendorIds, { reason });
  }
}