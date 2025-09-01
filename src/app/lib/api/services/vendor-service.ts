import { BaseRepository } from "../base-repository";
import { Vendor } from "../../../data/types/vendor";

export class VendorService extends BaseRepository<Vendor> {
  constructor() {
    super('/api/vendors');
  }

  // Custom methods specific to vendors
  async approveVendor(vendorId: string): Promise<Vendor> {
    return this.post<Vendor>(`/${vendorId}/approve`);
  }

  async rejectVendor(vendorId: string, reason?: string): Promise<Vendor> {
    return this.post<Vendor>(`/${vendorId}/reject`, { reason });
  }

  async suspendVendor(vendorId: string, reason?: string): Promise<Vendor> {
    return this.post<Vendor>(`/${vendorId}/suspend`, { reason });
  }

  async activateVendor(vendorId: string): Promise<Vendor> {
    return this.post<Vendor>(`/${vendorId}/activate`);
  }

  async getVendorDocuments(vendorId: string): Promise<any[]> {
    return this.get<any[]>(`/${vendorId}/documents`);
  }

  async uploadVendorDocument(vendorId: string, documentData: FormData): Promise<any> {
    // For file uploads, we might need to handle differently
    return this.post<any>(`/${vendorId}/documents`, documentData);
  }

  async bulkApproveVendors(vendorIds: string[]): Promise<void> {
    return this.bulkAction('approve', vendorIds);
  }

  async bulkRejectVendors(vendorIds: string[], reason?: string): Promise<void> {
    return this.bulkAction('reject', vendorIds, { reason });
  }
}

// Export singleton instance
export const vendorService = new VendorService();