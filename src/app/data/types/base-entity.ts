export interface BaseEntity {
  id: string;
  createdAt: string;
  createdBy?: string;
  modifiedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
}