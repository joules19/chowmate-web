import { BaseRepository } from '../base-repository';
import { EarningsPaginatedResponse } from '@/app/data/types/api';
import { OrderEarningsDto, GetOrderEarningsRequest } from '@/app/data/types/earnings';
import apiClient from '../axios-config';

export class EarningsRepository extends BaseRepository<OrderEarningsDto> {
  constructor() {
    super('/api/admin/order-earnings');
  }

  async getOrderEarnings(filters?: GetOrderEarningsRequest): Promise<EarningsPaginatedResponse<OrderEarningsDto>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      if (filters.vendorId) queryParams.append('vendorId', filters.vendorId);
      if (filters.distributionStatus !== undefined) {
        queryParams.append('distributionStatus', filters.distributionStatus.toString());
      }
      if (filters.pageNumber) queryParams.append('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
    }

    const path = queryParams.toString() ? `?${queryParams}` : '';
    return this.get<EarningsPaginatedResponse<OrderEarningsDto>>(path);
  }

  async getOrderEarningByOrderId(orderId: string): Promise<OrderEarningsDto> {
    return this.get<OrderEarningsDto>(`/order/${orderId}`);
  }

  async downloadTaxReport(startMonth: number, startYear: number, endMonth: number, endYear: number): Promise<Blob> {
    const queryParams = new URLSearchParams({
      startMonth: startMonth.toString(),
      startYear: startYear.toString(),
      endMonth: endMonth.toString(),
      endYear: endYear.toString(),
    });

    const response = await apiClient.get(`/api/admin/tax-report?${queryParams}`, {
      responseType: 'blob',
    });

    return response.data;
  }
}
