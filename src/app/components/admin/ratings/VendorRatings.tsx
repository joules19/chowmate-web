"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import { useVendors } from '@/app/lib/hooks/api-hooks.ts/use-vendor';
import { useVendorReviews } from '@/app/lib/hooks/api-hooks.ts/use-ratings';
import { VendorFilters, VendorSummary } from '@/app/data/types/vendor';
import { RatingFilters } from '@/app/data/types/rating';
import ReviewsList from './ReviewsList';

export default function VendorRatings() {
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedVendorName, setSelectedVendorName] = useState<string>('');

  const [vendorFilters, setVendorFilters] = useState<VendorFilters>({
    search: '',
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const [reviewFilters, setReviewFilters] = useState<RatingFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data: vendorsData, isLoading: vendorsLoading } = useVendors(vendorFilters);
  const { data: reviewsData, isLoading: reviewsLoading } = useVendorReviews(
    selectedVendorId || '',
    reviewFilters
  );

  const handleSearchChange = (search: string) => {
    setVendorFilters({
      ...vendorFilters,
      search,
      pageNumber: 1
    });
    setSelectedVendorId(null);
  };

  const handleVendorSelect = (vendorId: string, vendorName: string) => {
    setSelectedVendorId(vendorId);
    setSelectedVendorName(vendorName);
    setReviewFilters({ ...reviewFilters, pageNumber: 1 });
  };

  const handleBackToList = () => {
    setSelectedVendorId(null);
    setSelectedVendorName('');
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

  if (selectedVendorId) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToList}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
        >
          <span>←</span>
          <span>Back to vendors list</span>
        </button>
        <ReviewsList
          reviews={reviewsData?.items || []}
          totalCount={reviewsData?.totalCount || 0}
          filters={reviewFilters}
          onFiltersChange={setReviewFilters}
          isLoading={reviewsLoading}
          title={`Reviews for ${selectedVendorName}`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Section */}
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Search Vendors</h2>
        <div className="relative">
          <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search vendor by name..."
            value={vendorFilters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border-default rounded-button focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-text-primary"
          />
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Vendor Ratings</h2>

        {!vendorFilters.search ? (
          <div className="text-center py-8 text-text-secondary text-sm sm:text-base">
            Enter a vendor name in the search box above to begin
          </div>
        ) : vendorsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : vendorsData?.items && vendorsData.items.length > 0 ? (
          <div className="space-y-3">
            {vendorsData.items.map((vendor: VendorSummary) => (
              <div
                key={vendor.id}
                onClick={() => handleVendorSelect(vendor.id, vendor.businessName)}
                className="border border-border-light rounded-lg p-3 sm:p-4 hover:bg-surface-50 active:bg-surface-100 cursor-pointer transition-colors touch-manipulation"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary mb-1 text-sm sm:text-base break-words">
                      {vendor.businessName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-text-secondary mt-2">
                      {vendor.rating > 0 && (
                        <div className="flex items-center space-x-2">
                          {renderStars(vendor.rating)}
                          <span className="font-medium">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      {vendor.totalOrders > 0 && (
                        <span>
                          {vendor.totalOrders} {vendor.totalOrders === 1 ? 'order' : 'orders'}
                        </span>
                      )}
                    </div>
                    {vendor.email && (
                      <p className="text-xs sm:text-sm text-text-tertiary mt-1 break-all">
                        {vendor.email}
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
            No vendors found matching your search
          </div>
        )}

        {vendorFilters.search && vendorsData?.items && vendorsData.items.length > 0 && Math.ceil(vendorsData.totalCount / (vendorFilters.pageSize || 10)) > 1 && (
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 border-t border-border-light pt-4 mt-4">
            <div className="text-xs sm:text-sm text-text-secondary text-center xs:text-left">
              Page {vendorFilters.pageNumber || 1} of {Math.ceil(vendorsData.totalCount / (vendorFilters.pageSize || 10))}
            </div>
            <div className="flex justify-center xs:justify-end space-x-2">
              <button
                onClick={() => setVendorFilters({ ...vendorFilters, pageNumber: (vendorFilters.pageNumber || 1) - 1 })}
                disabled={(vendorFilters.pageNumber || 1) === 1}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-border-default rounded-button text-sm font-medium text-text-primary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
              >
                Previous
              </button>
              <button
                onClick={() => setVendorFilters({ ...vendorFilters, pageNumber: (vendorFilters.pageNumber || 1) + 1 })}
                disabled={(vendorFilters.pageNumber || 1) >= Math.ceil(vendorsData.totalCount / (vendorFilters.pageSize || 10))}
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
