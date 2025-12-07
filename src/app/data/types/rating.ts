export interface VendorRatingDto {
  id: string;
  userId: string;
  userName: string;
  vendorId: string;
  vendorName: string;
  orderId: string;
  orderNo: string;
  rating: number;
  review: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface RiderRatingDto {
  id: string;
  userId: string;
  userName: string;
  riderId: string;
  riderName: string;
  orderId: string;
  orderNo: string;
  rating: number;
  review: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface RatingFilters {
  search?: string;
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minRating?: number;
  maxRating?: number;
}
