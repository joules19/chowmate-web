"use client";

import { PromotionStats } from '@/app/data/types/promotion';
import { 
  TagIcon, 
  PlayIcon, 
  ClockIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

interface Props {
  stats?: PromotionStats;
}

export default function PromotionStatsCards({ stats }: Props) {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const statsData = [
    {
      title: 'Total Promotions',
      value: stats?.totalPromotions || 0,
      icon: TagIcon,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Promotions',
      value: stats?.activePromotions || 0,
      icon: PlayIcon,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Expired Promotions',
      value: stats?.expiredPromotions || 0,
      icon: ClockIcon,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Scheduled Promotions',
      value: stats?.scheduledPromotions || 0,
      icon: CalendarIcon,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Discount Value',
      value: formatCurrency(stats?.totalDiscountValue || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-50',
      isValueNumeric: false,
    },
    {
      title: 'Products with Promotions',
      value: stats?.productsWithPromotions || 0,
      icon: ShoppingBagIcon,
      color: 'bg-indigo-100 text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Vendors with Promotions',
      value: stats?.vendorsWithPromotions || 0,
      icon: BuildingStorefrontIcon,
      color: 'bg-teal-100 text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-card shadow-soft border border-border-light p-6 transition-all duration-200 hover:shadow-medium`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-secondary mb-1 truncate">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {stat.isValueNumeric === false ? stat.value : (stat.value as number).toLocaleString()}
                </p>
                
                {/* Progress indicator for active vs total */}
                {stat.title === 'Active Promotions' && stats && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-text-tertiary mb-1">
                      <span>Active Rate</span>
                      <span>
                        {stats.totalPromotions > 0 
                          ? Math.round((stats.activePromotions / stats.totalPromotions) * 100)
                          : 0
                        }%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: stats.totalPromotions > 0 
                            ? `${(stats.activePromotions / stats.totalPromotions) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Trend indicator for expired promotions */}
                {stat.title === 'Expired Promotions' && stats && stats.expiredPromotions > 0 && (
                  <div className="mt-1">
                    <span className="text-xs text-orange-600 font-medium">
                      {stats.totalPromotions > 0 
                        ? Math.round((stats.expiredPromotions / stats.totalPromotions) * 100)
                        : 0
                      }% of total
                    </span>
                  </div>
                )}
              </div>
              
              <div className={`h-12 w-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>

            {/* Additional insights */}
            {stat.title === 'Total Discount Value' && stats && stats.activePromotions > 0 && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs text-text-tertiary">
                  Avg per active promotion: {formatCurrency(stats.totalDiscountValue / stats.activePromotions)}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}