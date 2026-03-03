import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsRepository } from '../../api/repositories/settings-repository';
import {
  UpdateSettingRequest,
  CreatePricingTierRequest,
  UpdatePricingTierRequest,
} from '@/app/data/types/settings';

const settingsRepo = new SettingsRepository();

export const SETTINGS_QUERY_KEYS = {
  all: ['settings'] as const,
  systemSettings: (category?: string) => [...SETTINGS_QUERY_KEYS.all, 'system', category] as const,
  pricingTiers: (zoneId?: string) => [...SETTINGS_QUERY_KEYS.all, 'pricing-tiers', zoneId] as const,
  zones: (search?: string) => [...SETTINGS_QUERY_KEYS.all, 'zones', search] as const,
};

export function useSystemSettings(category?: string) {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.systemSettings(category),
    queryFn: () => settingsRepo.getSettings(category),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, request }: { key: string; request: UpdateSettingRequest }) =>
      settingsRepo.updateSetting(key, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
    },
  });
}

export function usePricingTiers(zoneId?: string) {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.pricingTiers(zoneId),
    queryFn: () => settingsRepo.getPricingTiers(zoneId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePricingTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePricingTierRequest) => settingsRepo.createPricingTier(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.pricingTiers() });
    },
  });
}

export function useUpdatePricingTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdatePricingTierRequest }) =>
      settingsRepo.updatePricingTier(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.pricingTiers() });
    },
  });
}

export function useDeletePricingTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => settingsRepo.deletePricingTier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.pricingTiers() });
    },
  });
}

export function useZoneSearch(search: string, enabled: boolean) {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.zones(search),
    queryFn: () => settingsRepo.searchZones(search),
    staleTime: 30 * 1000,
    enabled: enabled && search.length >= 2,
  });
}
