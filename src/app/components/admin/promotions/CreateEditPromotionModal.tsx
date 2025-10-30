"use client";

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  TagIcon, 
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PercentBadgeIcon
} from '@heroicons/react/24/outline';
import { ProductPromotion, CreateProductPromotionDto, UpdateProductPromotionDto, EligibleProduct } from '@/app/data/types/promotion';
import { useCreatePromotion, useUpdatePromotion, useEligibleProducts } from '@/app/lib/hooks/api-hooks/use-promotions';
import { message } from 'antd';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  promotion?: ProductPromotion;
}

export default function CreateEditPromotionModal({ isOpen, onClose, promotion }: Props) {
  const [formData, setFormData] = useState<CreateProductPromotionDto>({
    productId: '',
    isActive: true,
    description: ''
  });
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<EligibleProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const { data: eligibleProducts, isLoading: loadingProducts } = useEligibleProducts({
    search: searchQuery,
    excludeExisting: !promotion?.id
  });

  const isEditing = !!promotion;

  useEffect(() => {
    if (isOpen) {
      if (promotion) {
        setFormData({
          productId: promotion.productId,
          discountPercentage: promotion.discountPercentage,
          discountAmount: promotion.discountAmount,
          isActive: promotion.isActive,
          startDate: promotion.startDate ? promotion.startDate.split('T')[0] : undefined,
          endDate: promotion.endDate ? promotion.endDate.split('T')[0] : undefined,
          description: promotion.description || ''
        });
        setDiscountType(promotion.discountPercentage ? 'percentage' : 'amount');
        setSelectedProduct({
          id: promotion.productId,
          productName: promotion.productName,
          basePrice: promotion.basePrice,
          vendorId: promotion.vendorId,
          vendorName: promotion.vendorName,
          categoryId: '',
          categoryName: promotion.categoryName,
          hasActivePromotion: false
        });
      } else {
        setFormData({
          productId: '',
          isActive: true,
          description: ''
        });
        setDiscountType('percentage');
        setSelectedProduct(null);
        setSearchQuery('');
      }
      setErrors({});
    }
  }, [isOpen, promotion]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = 'Product is required';
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
      } else if (selectedProduct && formData.discountAmount >= selectedProduct.basePrice) {
        newErrors.discountAmount = 'Discount amount cannot be greater than or equal to product price';
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

  const calculateDiscountedPrice = () => {
    if (!selectedProduct) return 0;
    
    if (discountType === 'percentage' && formData.discountPercentage) {
      return selectedProduct.basePrice * (1 - formData.discountPercentage);
    } else if (discountType === 'amount' && formData.discountAmount) {
      return selectedProduct.basePrice - formData.discountAmount;
    }
    
    return selectedProduct.basePrice;
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

      if (isEditing && promotion) {
        await updateMutation.mutateAsync({
          id: promotion.id,
          data: submitData as UpdateProductPromotionDto
        });
        message.success('Promotion updated successfully');
      } else {
        await createMutation.mutateAsync(submitData);
        message.success('Promotion created successfully');
      }
      
      onClose();
    } catch (error: any) {
      message.error(error.message || 'Failed to save promotion');
    }
  };

  const handleProductSelect = (product: EligibleProduct) => {
    setSelectedProduct(product);
    setFormData(prev => ({ ...prev, productId: product.id }));
    setSearchQuery('');
    setErrors(prev => ({ ...prev, productId: '' }));
  };

  const handleDiscountTypeChange = (type: 'percentage' | 'amount') => {
    setDiscountType(type);
    setFormData(prev => ({
      ...prev,
      discountPercentage: type === 'percentage' ? prev.discountPercentage : undefined,
      discountAmount: type === 'amount' ? prev.discountAmount : undefined,
    }));
    setErrors(prev => ({ ...prev, discountPercentage: '', discountAmount: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <TagIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                {isEditing ? 'Edit Promotion' : 'Create New Promotion'}
              </h2>
              <p className="text-sm text-text-secondary">
                {isEditing ? 'Update promotion details' : 'Set up a new product promotion'}
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
          {/* Product Selection */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Product *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.productId ? 'border-red-500' : 'border-border-default'
                  }`}
                />
                
                {searchQuery && eligibleProducts && eligibleProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-surface-0 border border-border-default rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {eligibleProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductSelect(product)}
                        className="w-full text-left px-4 py-3 hover:bg-surface-hover border-b border-border-light last:border-b-0"
                      >
                        <div className="font-medium text-text-primary">{product.productName}</div>
                        <div className="text-sm text-text-secondary">
                          {product.vendorName} • {product.categoryName} • ₦{product.basePrice.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedProduct && (
                <div className="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-md">
                  <div className="font-medium text-text-primary">{selectedProduct.productName}</div>
                  <div className="text-sm text-text-secondary">
                    {selectedProduct.vendorName} • {selectedProduct.categoryName}
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    Base Price: ₦{selectedProduct.basePrice.toLocaleString()}
                  </div>
                </div>
              )}
              
              {errors.productId && (
                <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
              )}
            </div>
          )}

          {/* Selected Product Display for Editing */}
          {isEditing && selectedProduct && (
            <div className="p-4 bg-gray-50 border border-border-light rounded-md">
              <h4 className="font-medium text-text-primary mb-2">Product Details</h4>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Name:</span> {selectedProduct.productName}</div>
                <div><span className="font-medium">Vendor:</span> {selectedProduct.vendorName}</div>
                <div><span className="font-medium">Category:</span> {selectedProduct.categoryName}</div>
                <div><span className="font-medium">Base Price:</span> ₦{selectedProduct.basePrice.toLocaleString()}</div>
              </div>
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
                onClick={() => handleDiscountTypeChange('percentage')}
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
                <p className="text-sm text-text-secondary">Discount as a percentage of the original price</p>
              </button>
              
              <button
                type="button"
                onClick={() => handleDiscountTypeChange('amount')}
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

            {/* Price Preview */}
            {selectedProduct && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <h4 className="text-sm font-medium text-green-800 mb-2">Price Preview</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Original Price:</span>
                    <span className="line-through text-green-600">₦{selectedProduct.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-green-800">Discounted Price:</span>
                    <span className="text-green-800">₦{calculateDiscountedPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">You Save:</span>
                    <span className="text-green-700">
                      ₦{(selectedProduct.basePrice - calculateDiscountedPrice()).toLocaleString()}
                    </span>
                  </div>
                </div>
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
              placeholder="Optional description for this promotion..."
            />
          </div>

          {/* Status */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-text-primary">
              Activate promotion immediately
            </label>
          </div>

          {/* Warning for existing promotion */}
          {!isEditing && selectedProduct?.hasActivePromotion && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Product has active promotion</p>
                  <p>Creating a new promotion will deactivate the existing one.</p>
                </div>
              </div>
            </div>
          )}

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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending || updateMutation.isPending 
                ? 'Saving...' 
                : isEditing 
                ? 'Update Promotion' 
                : 'Create Promotion'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}