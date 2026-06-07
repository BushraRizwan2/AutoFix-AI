
import React from 'react';
import { Shop } from '../types';
import { StarIcon } from './icons/StarIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface ShopListProps {
  shops: Shop[];
  onBookAppointment: (shop: Shop) => void;
  onManualQuote: (shop: Shop) => void;
  isLoading: boolean;
  filters: {
    rating: number;
    priceRange: 'any' | 'low' | 'medium' | 'high';
    availability: boolean;
  };
  onFilterChange: (filter: keyof ShopListProps['filters'], value: any) => void;
}

const FilterButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
            isActive 
            ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/40'
            : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-violet-500'
        }`}
    >
        {children}
    </button>
);


export const ShopList: React.FC<ShopListProps> = ({ shops, onBookAppointment, onManualQuote, isLoading, filters, onFilterChange }) => {

  const filteredShops = shops.filter(shop => {
      if (filters.availability && !shop.availability) return false;
      if (filters.rating > 0 && shop.rating < filters.rating) return false;
      if (filters.priceRange !== 'any' && shop.priceRange !== filters.priceRange) return false;
      return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Choose a Local Shop</h2>
                <p className="text-slate-600 dark:text-slate-400">Book an appointment with the AI estimate or request a manual quote.</p>
            </div>
        </div>

        <div className="py-4 border-y border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filters:</span>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Rating:</span>
                {[1,2,3,4,5].map(r => (
                    <StarIcon key={r} onClick={() => onFilterChange('rating', filters.rating === r ? 0 : r)} className={`h-5 w-5 cursor-pointer transition-colors ${filters.rating >= r ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-400'}`}/>
                ))}
            </div>
             <div className="flex items-center gap-2">
                 <span className="text-xs text-slate-500 dark:text-slate-400">Price:</span>
                <FilterButton isActive={filters.priceRange === 'low'} onClick={() => onFilterChange('priceRange', 'low')}>$</FilterButton>
                <FilterButton isActive={filters.priceRange === 'medium'} onClick={() => onFilterChange('priceRange', 'medium')}>$$</FilterButton>
                <FilterButton isActive={filters.priceRange === 'high'} onClick={() => onFilterChange('priceRange', 'high')}>$$$</FilterButton>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                    <input type="checkbox" checked={filters.availability} onChange={(e) => onFilterChange('availability', e.target.checked)} className="sr-only" />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${filters.availability ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.availability ? 'translate-x-full' : ''}`}></div>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300">Open Now</span>
            </label>
        </div>
        
        <div className="space-y-4 mt-4">
            {filteredShops.length > 0 ? filteredShops.map((shop) => (
                <div 
                    key={shop.id} 
                    className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 border border-slate-200 dark:border-slate-700 card-interactive"
                >
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{shop.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                    <span>{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <StarIcon className="h-4 w-4 text-amber-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{shop.rating}</span>
                        <span>({shop.reviewCount} reviews)</span>
                        <CurrencyDollarIcon className="h-4 w-4 ml-2" />
                        <span className="capitalize">{shop.priceRange}</span>
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto items-center justify-end">
                    <button
                        onClick={() => onManualQuote(shop)}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 font-semibold p-2.5 sm:px-4 sm:py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                        title="Request Manual Quote"
                    >
                        <DocumentTextIcon className="h-5 w-5" />
                        <span className="hidden sm:inline ml-1.5 text-sm">Request Manual Quote</span>
                    </button>
                     <button
                        onClick={() => onBookAppointment(shop)}
                        disabled={isLoading || !shop.availability}
                        className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-2.5 sm:px-4 sm:py-2 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all disabled:from-slate-400 disabled:to-slate-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        title="Book with AI Estimate"
                    >
                        <SparklesIcon className="h-5 w-5" />
                        <span className="hidden sm:inline text-sm">Book with AI Estimate</span>
                    </button>
                </div>
                </div>
            )) : (
                <div className="text-center p-8 text-slate-500 dark:text-slate-500">
                    <p>No shops match your current filters.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
