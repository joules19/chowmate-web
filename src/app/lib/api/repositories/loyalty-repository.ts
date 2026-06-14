import { BaseRepository } from '../base-repository';
import {
  LoyaltyCustomer,
  LoyaltyCustomerFilters,
  LoyaltyCustomerListResponse,
  LoyaltyRank,
  RewardTier,
  RunMonthlyCreditsRequest,
  UpdateRankRequest,
  UpdateTierRequest,
} from '@/app/data/types/loyalty';

export class LoyaltyRepository extends BaseRepository<LoyaltyCustomer> {
  constructor() {
    super('api/admin/loyalty');
  }

  async getCustomers(filters?: LoyaltyCustomerFilters): Promise<LoyaltyCustomerListResponse> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const qs = queryParams.toString();
    return this.get<LoyaltyCustomerListResponse>(`/customers${qs ? `?${qs}` : ''}`);
  }

  async getRanks(): Promise<LoyaltyRank[]> {
    return this.get<LoyaltyRank[]>('/ranks');
  }

  async updateRank(rankId: string, data: UpdateRankRequest): Promise<LoyaltyRank> {
    return this.put<LoyaltyRank>(`/ranks/${rankId}`, data as unknown as Record<string, unknown>);
  }

  async updateTier(rankId: string, tierId: string, data: UpdateTierRequest): Promise<RewardTier> {
    return this.put<RewardTier>(
      `/ranks/${rankId}/tiers/${tierId}`,
      data as unknown as Record<string, unknown>
    );
  }

  async runFullBackfill(): Promise<boolean> {
    return this.post<boolean>('/backfill');
  }

  async runCustomerBackfill(customerId: string): Promise<boolean> {
    return this.post<boolean>(`/backfill/${customerId}`);
  }

  async runMonthlyCredits(data: RunMonthlyCreditsRequest): Promise<boolean> {
    return this.post<boolean>('/monthly-credits/run', data as unknown as Record<string, unknown>);
  }
}
