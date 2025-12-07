"use client";

import { useState } from 'react';
import { VendorRatingDto, RiderRatingDto, RatingFilters } from '@/app/data/types/rating';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ReviewsListProps {
  reviews: (VendorRatingDto | RiderRatingDto)[];
  totalCount: number;
  filters: RatingFilters;
  onFiltersChange: (filters: RatingFilters) => void;
  isLoading: boolean;
  title: string;
}

export default function ReviewsList({
  reviews,
  totalCount,
  filters,
  onFiltersChange,
  isLoading,
  title
}: ReviewsListProps) {
  // Ensure reviews is always an array
  const reviewsList = Array.isArray(reviews) ? reviews : [];
  const totalPages = Math.ceil(totalCount / filters.pageSize);
  const [copiedOrderNo, setCopiedOrderNo] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleCopyOrderNo = async (orderNo: string) => {
    try {
      await navigator.clipboard.writeText(orderNo);
      setCopiedOrderNo(orderNo);
      setTimeout(() => setCopiedOrderNo(null), 2000);
    } catch (err) {
      console.error('Failed to copy order number:', err);
    }
  };

  const handlePageChange = (newPage: number) => {
    onFiltersChange({ ...filters, pageNumber: newPage });
  };

  if (isLoading) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reviewsList.length === 0) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-4">{title}</h2>
        <div className="text-center py-8 text-text-secondary text-sm sm:text-base">
          No reviews found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-text-primary">{title}</h2>
        <span className="text-xs sm:text-sm text-text-secondary">
          {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {reviewsList.map((review) => (
          <div
            key={review.id}
            className="border border-border-light rounded-lg p-3 sm:p-4 hover:bg-surface-50 transition-colors"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                <span className="font-medium text-text-primary text-sm sm:text-base break-all">
                  {review.userName}
                </span>
                {renderStars(review.rating)}
              </div>
              <div className="flex flex-wrap items-center text-xs text-text-tertiary gap-x-2 gap-y-1">
                <span className="break-all">Order: {review.orderNo}</span>
                <button
                  onClick={() => handleCopyOrderNo(review.orderNo)}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors p-1 -m-1"
                  title="Copy order number"
                  aria-label="Copy order number"
                >
                  {copiedOrderNo === review.orderNo ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                  ) : (
                    <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                  )}
                </button>
                <span className="hidden xs:inline">•</span>
                <span className="text-xs">{formatDate(review.createdAt)}</span>
              </div>
            </div>
            <p className="text-sm text-text-secondary mt-2 break-words">
              {review.review || <span className="italic text-text-tertiary">No review</span>}
            </p>
          </div>
        ))}
      </div>

      {reviewsList.length > 0 && totalPages > 1 && (
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 border-t border-border-light pt-4 mt-4">
          <div className="text-xs sm:text-sm text-text-secondary text-center xs:text-left">
            Page {filters.pageNumber} of {totalPages}
          </div>
          <div className="flex justify-center xs:justify-end space-x-2">
            <button
              onClick={() => handlePageChange(filters.pageNumber - 1)}
              disabled={filters.pageNumber === 1}
              className="px-3 py-2 sm:px-4 sm:py-2 border border-border-default rounded-button text-sm font-medium text-text-primary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => handlePageChange(filters.pageNumber + 1)}
              disabled={filters.pageNumber === totalPages}
              className="px-3 py-2 sm:px-4 sm:py-2 border border-border-default rounded-button text-sm font-medium text-text-primary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
