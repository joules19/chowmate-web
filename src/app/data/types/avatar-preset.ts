export interface AvatarPresetDto {
  id: string;
  name: string;
  url: string;
  displayOrder: number;
}

export interface CreateAvatarPresetRequest extends Record<string, unknown> {
  name: string;
  url: string;
  displayOrder?: number;
}
