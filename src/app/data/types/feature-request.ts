export enum FeatureRequestStatus {
  PENDING = 'Pending',
  UNDER_REVIEW = 'UnderReview',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  IMPLEMENTED = 'Implemented'
}

export enum FeatureRequestCategory {
  USER_EXPERIENCE = 'UserExperience',
  PERFORMANCE = 'Performance',
  SECURITY = 'Security',
  INTEGRATION = 'Integration',
  MOBILE_APP = 'MobileApp',
  WEB_APP = 'WebApp',
  ADMIN_PANEL = 'AdminPanel',
  PAYMENT = 'Payment',
  DELIVERY = 'Delivery',
  OTHER = 'Other'
}

export enum FeatureRequestPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface CreateFeatureRequestDto {
  title: string;
  description: string;
  category: FeatureRequestCategory;
  priority: FeatureRequestPriority;
  expectedBenefit?: string;
  attachments?: string[];
}

export interface UpdateFeatureRequestStatusDto {
  status: FeatureRequestStatus;
  reviewNotes?: string;
  estimatedImplementationDate?: string;
}

export interface FeatureRequestResponseDto {
  id: string;
  title: string;
  description: string;
  category: FeatureRequestCategory;
  priority: FeatureRequestPriority;
  status: FeatureRequestStatus;
  expectedBenefit?: string;
  attachments?: string[];
  submittedBy: string;
  submittedByName?: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  estimatedImplementationDate?: string;
  implementedAt?: string;
  upvotes: number;
  downvotes: number;
}

export interface FeatureRequestFilterDto {
  page?: number;
  pageSize?: number;
  status?: FeatureRequestStatus;
  category?: FeatureRequestCategory;
  priority?: FeatureRequestPriority;
  submittedBy?: string;
  searchTerm?: string;
  sortBy?: 'submittedAt' | 'priority' | 'status' | 'upvotes';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

export interface FeatureRequestStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  implemented: number;
}