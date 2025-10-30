"use client";

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PercentBadgeIcon,
  BuildingStorefrontIcon,
  TagIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { BulkPromotionDto, EligibleProduct, Vendor, Category } from '@/app/data/types/promotion';
import { useCreateBulkPromotions, useEligibleProducts, useVendors, useCategories } from '@/app/lib/hooks/api-hooks/use-promotions';
import { message } from 'antd';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type BulkType = 'specific' | 'vendor' | 'category';

export default function BulkPromotionModal({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState<BulkPromotionDto>({
    productIds: [],
    description: ''
  });
  const [bulkType, setBulkType] = useState<BulkType>('specific');
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<EligibleProduct[]>([]);

  const createBulkMutation = useCreateBulkPromotions();
  const { data: eligibleProducts } = useEligibleProducts({ 
    search: searchQuery,
    vendorId: bulkType === 'vendor' ? formData.vendorId : undefined,
    categoryId: bulkType === 'category' ? formData.categoryId : undefined,
    excludeExisting: true
  });
  const { data: vendors } = useVendors();
  const { data: categories } = useCategories();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productIds: [],
        description: ''
      });
      setBulkType('specific');
      setDiscountType('percentage');
      setSelectedProducts([]);
      setSearchQuery('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (bulkType === 'specific' && formData.productIds.length === 0) {
      newErrors.productIds = 'At least one product must be selected';
    } else if (bulkType === 'vendor' && !formData.vendorId) {
      newErrors.vendorId = 'Vendor selection is required';
    } else if (bulkType === 'category' && !formData.categoryId) {
      newErrors.categoryId = 'Category selection is required';
    }

    if (discountType === 'percentage') {
      if (!formData.discountPercentage) {
        newErrors.discountPercentage = 'Discount percentage is required';
      } else if (formData.discountPercentage <= 0 || formData.discountPercentage > 1) {
        newErrors.discountPercentage = 'Discount percentage must be between 1% and 100%';
      }
    } else {
      if (!formData.discountAmount) {
        newErrors.discountAmount = 'Discount amount is required';
      } else if (formData.discountAmount <= 0) {
        newErrors.discountAmount = 'Discount amount must be greater than 0';
      }
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        discountPercentage: discountType === 'percentage' ? formData.discountPercentage : undefined,
        discountAmount: discountType === 'amount' ? formData.discountAmount : undefined,
      };

      const result = await createBulkMutation.mutateAsync(submitData);
      message.success(`Successfully created ${result.createdCount} promotions`);
      onClose();
    } catch (error: any) {
      message.error(error.message || 'Failed to create bulk promotions');
    }
  };

  const handleProductToggle = (product: EligibleProduct) => {
    const isSelected = formData.productIds.includes(product.id);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        productIds: prev.productIds.filter(id => id !== product.id)
      }));
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setFormData(prev => ({
        ...prev,
        productIds: [...prev.productIds, product.id]
      }));
      setSelectedProducts(prev => [...prev, product]);
    }
    
    setErrors(prev => ({ ...prev, productIds: '' }));
  };

  const handleBulkTypeChange = (type: BulkType) => {
    setBulkType(type);
    setFormData(prev => ({
      ...prev,
      productIds: [],
      vendorId: undefined,
      categoryId: undefined
    }));
    setSelectedProducts([]);
    setSearchQuery('');
    setErrors({});
  };

  const getEstimatedProductCount = () => {
    if (bulkType === 'specific') {
      return selectedProducts.length;
    } else if (bulkType === 'vendor' && formData.vendorId) {
      return eligibleProducts?.length || 0;
    } else if (bulkType === 'category' && formData.categoryId) {
      return eligibleProducts?.length || 0;
    }
    return 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Create Bulk Promotions
              </h2>
              <p className="text-sm text-text-secondary">
                Apply promotions to multiple products at once
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Bulk Type Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Target Products *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleBulkTypeChange('specific')}
                className={`p-4 border rounded-lg text-left transition-all ${
                  bulkType === 'specific'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-border-default hover:border-border-hover'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span className="font-medium">Specific Products</span>
                </div>
                <p className="text-sm text-text-secondary">Select individual products</p>
              </button>
              
              <button
                type="button"
                onClick={() => handleBulkTypeChange('vendor')}
                className={`p-4 border rounded-lg text-left transition-all ${
                  bulkType === 'vendor'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-border-default hover:border-border-hover'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <BuildingStorefrontIcon className="h-5 w-5" />
                  <span className="font-medium">By Vendor</span>
                </div>
                <p className="text-sm text-text-secondary">All products from a vendor</p>
              </button>
              
              <button
                type="button"
                onClick={() => handleBulkTypeChange('category')}
                className={`p-4 border rounded-lg text-left transition-all ${
                  bulkType === 'category'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-border-default hover:border-border-hover'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <TagIcon className="h-5 w-5" />
                  <span className="font-medium">By Category</span>
                </div>
                <p className="text-sm text-text-secondary">All products in a category</p>
              </button>
            </div>
          </div>

          {/* Product Selection Based on Type */}
          {bulkType === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Products *
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                
                {eligibleProducts && eligibleProducts.length > 0 && (
                  <div className="border border-border-default rounded-md max-h-60 overflow-y-auto">
                    {eligibleProducts.map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center space-x-3 p-3 hover:bg-surface-hover border-b border-border-light last:border-b-0 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.productIds.includes(product.id)}
                          onChange={() => handleProductToggle(product)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-text-primary">{product.productName}</div>
                          <div className="text-sm text-text-secondary">
                            {product.vendorName} • {product.categoryName} • ₦{product.basePrice.toLocaleString()}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                
                {selectedProducts.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Selected Products ({selectedProducts.length})
                    </p>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="text-sm text-blue-700">
                          {product.productName} - ₦{product.basePrice.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {errors.productIds && (
                <p className="mt-1 text-sm text-red-600">{errors.productIds}</p>
              )}
            </div>
          )}

          {bulkType === 'vendor' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Vendor *
              </label>
              <select
                value={formData.vendorId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, vendorId: e.target.value || undefined }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.vendorId ? 'border-red-500' : 'border-border-default'
                }`}
              >
                <option value="">Choose a vendor...</option>
                {vendors?.map((vendor: Vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.businessName}
                  </option>
                ))}
              </select>
              {errors.vendorId && (
                <p className="mt-1 text-sm text-red-600">{errors.vendorId}</p>
              )}
            </div>
          )}

          {bulkType === 'category' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Category *
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value || undefined }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.categoryId ? 'border-red-500' : 'border-border-default'
                }`}
              >
                <option value="">Choose a category...</option>
                {categories?.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>
          )}

          {/* Estimated Product Count */}
          {getEstimatedProductCount() > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <span className="font-medium">Estimated products:</span> {getEstimatedProductCount()} products will receive this promotion
              </p>
            </div>
          )}

          {/* Discount Type Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Discount Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`p-4 border rounded-lg text-left transition-all ${
                  discountType === 'percentage'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-border-default hover:border-border-hover'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <PercentBadgeIcon className="h-5 w-5" />
                  <span className="font-medium">Percentage</span>
                </div>
                <p className="text-sm text-text-secondary">Discount as a percentage</p>
              </button>
              
              <button
                type="button"
                onClick={() => setDiscountType('amount')}
                className={`p-4 border rounded-lg text-left transition-all ${
                  discountType === 'amount'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-border-default hover:border-border-hover'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <CurrencyDollarIcon className="h-5 w-5" />
                  <span className="font-medium">Fixed Amount</span>
                </div>
                <p className="text-sm text-text-secondary">Fixed discount amount</p>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discountType === 'percentage' ? (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Discount Percentage *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={formData.discountPercentage ? (formData.discountPercentage * 100) : ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      discountPercentage: e.target.value ? parseFloat(e.target.value) / 100 : undefined 
                    }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10 ${
                      errors.discountPercentage ? 'border-red-500' : 'border-border-default'
                    }`}
                    placeholder="15"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-text-secondary">%</span>
                  </div>
                </div>
                {errors.discountPercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.discountPercentage}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Discount Amount *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.discountAmount || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      discountAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-8 ${
                      errors.discountAmount ? 'border-red-500' : 'border-border-default'
                    }`}
                    placeholder="5000"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-text-secondary">₦</span>
                  </div>
                </div>
                {errors.discountAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.discountAmount}</p>
                )}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value || undefined }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.endDate ? 'border-red-500' : 'border-border-default'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Optional description for these promotions..."
            />
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important</p>
                <p>Any existing active promotions on the selected products will be deactivated and replaced with this new promotion.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border-light">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border-default rounded-md hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createBulkMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createBulkMutation.isPending 
                ? 'Creating Promotions...' 
                : `Create ${getEstimatedProductCount()} Promotions`
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}