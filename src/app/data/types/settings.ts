export interface SystemSettingDto {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  dataType: string;
  isActive: boolean;
  isReadOnly: boolean;
}

export interface DeliveryPricingTierDto {
  id: string;
  zoneId: string | null;
  zoneName: string | null;
  minKm: number;
  maxKm: number;
  fee: number;
  isActive: boolean;
  sortOrder: number;
  isGlobal: boolean;
}

export interface ZoneDto {
  id: string;
  name: string;
  zoneCode: string;
  description: string;
  isActive: boolean;
  deliveryFee: number;
  estimatedDeliveryTime: string;
}

export interface UpdateSettingRequest {
  value: string;
}

export interface CreatePricingTierRequest {
  zoneId: string | null;
  minKm: number;
  maxKm: number;
  fee: number;
  isActive: boolean;
  sortOrder: number;
}

export interface UpdatePricingTierRequest {
  minKm: number;
  maxKm: number;
  fee: number;
  isActive: boolean;
  sortOrder: number;
}
