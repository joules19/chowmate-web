"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import { useRiders } from '@/app/lib/hooks/api-hooks.ts/use-rider';
import { useRiderReviews } from '@/app/lib/hooks/api-hooks.ts/use-ratings';
import { RiderFilters } from '@/app/lib/api/repositories/rider-repository';
import { RatingFilters } from '@/app/data/types/rating';
import ReviewsList from './ReviewsList';
import { RiderSummary } from '@/app/data/types/rider';

export default function RiderRatings() {
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [selectedRiderName, setSelectedRiderName] = useState<string>('');

  const [riderFilters, setRiderFilters] = useState<RiderFilters>({
    search: '',
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [reviewFilters, setReviewFilters] = useState<RatingFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data: ridersData, isLoading: ridersLoading } = useRiders(riderFilters);
  const { data: reviewsData, isLoading: reviewsLoading } = useRiderReviews(
    selectedRiderId || '',
    reviewFilters
  );

  const handleSearchChange = (search: string) => {
    setRiderFilters({
      ...riderFilters,
      search,
      pageNumber: 1
    });
    setSelectedRiderId(null);
  };

  const handleRiderSelect = (riderId: string, riderName: string) => {
    setSelectedRiderId(riderId);
    setSelectedRiderName(riderName);
    setReviewFilters({ ...reviewFilters, pageNumber: 1 });
  };

  const handleBackToList = () => {
    setSelectedRiderId(null);
    setSelectedRiderName('');
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  if (selectedRiderId) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToList}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
        >
          <span>←</span>
          <span>Back to riders list</span>
        </button>
        <ReviewsList
          reviews={reviewsData?.items || []}
          totalCount={reviewsData?.totalCount || 0}
          filters={reviewFilters}
          onFiltersChange={setReviewFilters}
          isLoading={reviewsLoading}
          title={`Reviews for ${selectedRiderName}`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Section */}
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Search Riders</h2>
        <div className="relative">
          <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search rider by name..."
            value={riderFilters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border-default rounded-button focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-text-primary"
          />
        </div>
      </div>

      {/* Riders List */}
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Rider Ratings</h2>

        {!riderFilters.search ? (
          <div className="text-center py-8 text-text-secondary text-sm sm:text-base">
            Enter a rider name in the search box above to begin
          </div>
        ) : ridersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : ridersData?.items && ridersData.items.length > 0 ? (
          <div className="space-y-3">
            {ridersData.items.map((rider: RiderSummary) => (
              <div
                key={rider.id}
                onClick={() => handleRiderSelect(rider.id, rider.fullName)}
                className="border border-border-light rounded-lg p-3 sm:p-4 hover:bg-surface-50 active:bg-surface-100 cursor-pointer transition-colors touch-manipulation"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary mb-1 text-sm sm:text-base break-words">
                      {rider.fullName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-text-secondary">
                      {rider.rating && (
                        <div className="flex items-center space-x-2">
                          {renderStars(rider.rating)}
                          <span className="font-medium">
                            {rider.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      {rider.completedDeliveries && (
                        <span>
                          {rider.completedDeliveries} {rider.completedDeliveries === 1 ? 'delivery' : 'deliveries'}
                        </span>
                      )}
                    </div>
                    {rider.phoneNumber && (
                      <p className="text-xs sm:text-sm text-text-tertiary mt-1 break-all">
                        {rider.phoneNumber}
                      </p>
                    )}
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm self-start sm:self-auto whitespace-nowrap">
                    View Reviews →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary text-sm sm:text-base">
            No riders found matching your search
          </div>
        )}

        {riderFilters.search && ridersData?.items && ridersData.items.length > 0 && Math.ceil(ridersData.totalCount / (riderFilters.pageSize || 10)) > 1 && (
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 border-t border-border-light pt-4 mt-4">
            <div className="text-xs sm:text-sm text-text-secondary text-center xs:text-left">
              Page {riderFilters.pageNumber || 1} of {Math.ceil(ridersData.totalCount / (riderFilters.pageSize || 10))}
            </div>
            <div className="flex justify-center xs:justify-end space-x-2">
              <button
                onClick={() => setRiderFilters({ ...riderFilters, pageNumber: (riderFilters.pageNumber || 1) - 1 })}
                disabled={(riderFilters.pageNumber || 1) === 1}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-border-default rounded-button text-sm font-medium text-text-primary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
              >
                Previous
              </button>
              <button
                onClick={() => setRiderFilters({ ...riderFilters, pageNumber: (riderFilters.pageNumber || 1) + 1 })}
                disabled={(riderFilters.pageNumber || 1) >= Math.ceil(ridersData.totalCount / (riderFilters.pageSize || 10))}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-border-default rounded-button text-sm font-medium text-text-primary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
