export interface BaseEntity extends Record<string, unknown> {
  id: string;
  createdAt: string;
  createdBy?: string;
  modifiedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
}