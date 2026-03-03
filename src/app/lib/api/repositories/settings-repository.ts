import {
  SystemSettingDto,
  DeliveryPricingTierDto,
  ZoneDto,
  UpdateSettingRequest,
  CreatePricingTierRequest,
  UpdatePricingTierRequest,
} from '@/app/data/types/settings';
import { BaseRepository } from '../base-repository';

export class SettingsRepository extends BaseRepository<SystemSettingDto> {
  constructor() {
    super('api/admin/settings');
  }

  async getSettings(category?: string): Promise<SystemSettingDto[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.get<SystemSettingDto[]>(query);
  }

  async updateSetting(key: string, request: UpdateSettingRequest): Promise<SystemSettingDto> {
    return this.put<SystemSettingDto>(`/${encodeURIComponent(key)}`, request as unknown as Record<string, unknown>);
  }

  async getPricingTiers(zoneId?: string): Promise<DeliveryPricingTierDto[]> {
    const query = zoneId !== undefined ? `?zoneId=${encodeURIComponent(zoneId)}` : '';
    return this.get<DeliveryPricingTierDto[]>(`/pricing-tiers${query}`);
  }

  async createPricingTier(request: CreatePricingTierRequest): Promise<DeliveryPricingTierDto> {
    return this.post<DeliveryPricingTierDto>('/pricing-tiers', request as unknown as Record<string, unknown>);
  }

  async updatePricingTier(id: string, request: UpdatePricingTierRequest): Promise<DeliveryPricingTierDto> {
    return this.put<DeliveryPricingTierDto>(`/pricing-tiers/${id}`, request as unknown as Record<string, unknown>);
  }

  async deletePricingTier(id: string): Promise<void> {
    return this.deleteRequest<void>(`/pricing-tiers/${id}`);
  }

  async searchZones(search?: string): Promise<ZoneDto[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.get<ZoneDto[]>(`/zones${query}`);
  }
}
