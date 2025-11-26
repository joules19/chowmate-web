import { AuthService } from '../../auth/auth-service';
import { BaseRepository } from '../base-repository';
import apiClient from '../axios-config'; // Import apiClient

export interface CustomerClassReportFilterDto {
  startMonth?: number;  // 1-12
  startYear?: number;
  endMonth?: number;    // 1-12
  endYear?: number;
  usePercentileClassification?: boolean;
  firstClassThreshold?: number;
  middleClassThreshold?: number;
}

export class ReportRepository extends BaseRepository<any> {
  constructor() {
    super('/api/admin/customer-order-reports');
  }

  /**
   * Generate and download customer class report CSV
   */
  async downloadCustomerClassReportCsv(
    filter?: CustomerClassReportFilterDto
  ): Promise<Blob> {
    const params = new URLSearchParams();

    if (filter) {
      if (filter.startMonth) params.append('StartMonth', filter.startMonth.toString());
      if (filter.startYear) params.append('StartYear', filter.startYear.toString());
      if (filter.endMonth) params.append('EndMonth', filter.endMonth.toString());
      if (filter.endYear) params.append('EndYear', filter.endYear.toString());
      if (filter.usePercentileClassification !== undefined) {
        params.append('UsePercentileClassification', filter.usePercentileClassification.toString());
      }
      if (filter.firstClassThreshold) {
        params.append('FirstClassThreshold', filter.firstClassThreshold.toString());
      }
      if (filter.middleClassThreshold) {
        params.append('MiddleClassThreshold', filter.middleClassThreshold.toString());
      }
    }

    const queryString = params.toString();
    // Construct URL using apiClient's baseURL
    const baseUrl = apiClient.defaults.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://chowmate-db2u.onrender.com';
    const url = queryString
      ? `${baseUrl}${this.endpoint}/export/customer-class-report/csv?${queryString}`
      : `${baseUrl}${this.endpoint}/export/customer-class-report/csv`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`, // Use AuthService directly
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to download report');
    }

    return await response.blob();
  }

  /**
   * Get customer class report as text for preview
   */
  async getCustomerClassReportPreview(
    filter?: CustomerClassReportFilterDto
  ): Promise<string> {
    const blob = await this.downloadCustomerClassReportCsv(filter);
    return await blob.text();
  }
}

