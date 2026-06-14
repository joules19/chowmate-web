export interface LoyaltyCustomer {
  customerId: string;
  customerName: string;
  email: string;
  rankName: string;
  rankImageUrl?: string;
  lifetimePoints: number;
  totalOrders: number;
  rookieCreditAwarded: boolean;
}

export interface LoyaltyCustomerFilters {
  pageNumber?: number;
  pageSize?: number;
  rankName?: string;
  search?: string;
}

export interface LoyaltyCustomerListResponse {
  items: LoyaltyCustomer[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface RewardTier {
  id: string;
  monthlyOrdersNeeded: number;
  creditsAwarded: number;
}

export interface LoyaltyRank {
  id: string;
  name: string;
  displayOrder: number;
  minLifetimePoints: number;
  monthlyMaxFreeDeliveries: number;
  isRookieSpecial: boolean;
  rankImageUrl?: string;
  rewardTiers: RewardTier[];
}

export interface UpdateRankRequest {
  minLifetimePoints: number;
  monthlyMaxFreeDeliveries: number;
}

export interface UpdateTierRequest {
  monthlyOrdersNeeded: number;
  creditsAwarded: number;
}

export interface RunMonthlyCreditsRequest {
  year: number;
  month: number;
}

export const RANK_NAMES = ['Rookie', 'Regular', 'Pro', 'Elite', 'Legend'] as const;
export type RankName = typeof RANK_NAMES[number];
