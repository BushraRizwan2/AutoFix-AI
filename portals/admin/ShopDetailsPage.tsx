
import React from 'react';
import { Shop } from '../../types';
import { BuildingStorefrontIcon } from '../../components/icons/BuildingStorefrontIcon';
import { MapPinIcon } from '../../components/icons/MapPinIcon';
import { StarIcon } from '../../components/icons/StarIcon';
import { PhoneIcon } from '../../components/icons/PhoneIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../../components/icons/XCircleIcon';

interface ShopDetailsPageProps {
  shop: Shop;
  onUpdateShop: (shopId: number, updates: Partial<Shop>) => void;
  onBack: () => void;
}

const InfoRow: React.FC<{label: string, value: React.ReactNode, icon: React.FC<any>}> = ({label, value, icon: Icon}) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
        <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{value}</p>
        </div>
    </div>
)

export const ShopDetailsPage: React.FC<ShopDetailsPageProps> = ({ shop, onUpdateShop, onBack }) => {

    const handleUpdateStatus = (status: Shop['status']) => {
        onUpdateShop(shop.id, { status });
    };

    return (
        <div className="animate-in fade-in duration-300">
             <button onClick={onBack} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors mb-4">
                &larr; Back to all shops
            </button>
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="p-8">
                     <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <BuildingStorefrontIcon className="h-12 w-12 text-violet-500 dark:text-violet-400" />
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{shop.name}</h1>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">Shop ID: {shop.id}</p>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                               <InfoRow label="Address" value={shop.address} icon={MapPinIcon} />
                               <InfoRow label="Phone" value={shop.phone || 'N/A'} icon={PhoneIcon} />
                               <InfoRow label="Rating" value={`${shop.rating} (${shop.reviewCount} reviews)`} icon={StarIcon} />
                               <InfoRow label="Status" value={shop.status} icon={BuildingStorefrontIcon} />
                            </div>
                        </div>
                     </div>
                </div>
                  <div className="bg-slate-100 dark:bg-slate-800/80 p-6 flex flex-row justify-end items-center gap-3 border-t border-slate-200 dark:border-slate-700/50">
                     <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mr-auto hidden sm:block">Admin Actions:</p>
                     {shop.status === 'Pending' && (
                        <button 
                            onClick={() => handleUpdateStatus('Approved')} 
                            className="flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold p-2.5 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
                            title="Approve Registration"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Approve Registration</span>
                        </button>
                     )}
                      {(shop.status === 'Approved' || shop.status === 'Suspended') && (
                        <button 
                            onClick={() => handleUpdateStatus(shop.status === 'Approved' ? 'Suspended' : 'Approved')} 
                            className={`flex items-center justify-center gap-2 font-semibold p-2.5 sm:px-4 sm:py-2 rounded-lg transition-colors ${
                                shop.status === 'Approved' 
                                ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30' 
                                : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'
                            }`}
                            title={shop.status === 'Approved' ? 'Suspend Shop' : 'Re-approve Shop'}
                        >
                            {shop.status === 'Approved' ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                            <span className="hidden sm:inline">
                                {shop.status === 'Approved' ? 'Suspend Shop' : 'Re-approve Shop'}
                            </span>
                        </button>
                     )}
                </div>
            </div>
        </div>
    );
};
