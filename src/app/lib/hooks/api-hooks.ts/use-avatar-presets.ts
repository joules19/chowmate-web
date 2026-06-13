import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AvatarPresetRepository } from '../../api/repositories/avatar-preset-repository';
import { CreateAvatarPresetRequest } from '@/app/data/types/avatar-preset';

const avatarPresetRepo = new AvatarPresetRepository();

export const AVATAR_PRESET_QUERY_KEYS = {
  all: ['avatar-presets'] as const,
  lists: (includeInactive?: boolean) => [...AVATAR_PRESET_QUERY_KEYS.all, 'list', includeInactive] as const,
};

export function useAvatarPresets(includeInactive = false) {
  return useQuery({
    queryKey: AVATAR_PRESET_QUERY_KEYS.lists(includeInactive),
    queryFn: () => avatarPresetRepo.getAvatarPresets(includeInactive),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAvatarPreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAvatarPresetRequest) =>
      avatarPresetRepo.createAvatarPreset(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVATAR_PRESET_QUERY_KEYS.all });
    },
  });
}

export function useDeleteAvatarPreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => avatarPresetRepo.deleteAvatarPreset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVATAR_PRESET_QUERY_KEYS.all });
    },
  });
}
