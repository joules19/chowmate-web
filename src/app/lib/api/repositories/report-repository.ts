import { AuthService } from '../../auth/auth-service';

export interface CustomerClassReportFilterDto {
  startMonth?: number;  // 1-12
  startYear?: number;
  endMonth?: number;    // 1-12
  endYear?: number;
  usePercentileClassification?: boolean;
  firstClassThreshold?: number;
  middleClassThreshold?: number;
}

export class ReportRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
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
    const url = queryString
      ? `${this.baseUrl}/api/admin/customer-order-reports/export/customer-class-report/csv?${queryString}`
      : `${this.baseUrl}/api/admin/customer-order-reports/export/customer-class-report/csv`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
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

  private getAuthToken(): string {
    return AuthService.getToken() || '';
  }
}
