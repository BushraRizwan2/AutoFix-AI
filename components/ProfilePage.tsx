
import React, { useState } from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { User, Shop, Job } from '../types';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { EditShopDetailsModal } from './EditShopDetailsModal';

interface ProfilePageProps {
    user: User | null;
    onLogout: () => void;
    onOpenSettings: () => void;
    shop?: Shop;
    jobs?: Job[];
    onUpdateShop?: (updates: Partial<Shop>) => void;
    onViewInvoice?: (job: Job) => void;
}

const AvailabilityToggle: React.FC<{ shop: Shop, onUpdateShop: (updates: Partial<Shop>) => void }> = ({ shop, onUpdateShop }) => {
    const [isAvailable, setIsAvailable] = useState(shop.availability);

    const handleToggle = () => {
        const newAvailability = !isAvailable;
        setIsAvailable(newAvailability);
        onUpdateShop({ availability: newAvailability });
    };

    return (
        <div className="mt-8 bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Shop Availability</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Accepting new jobs?</p>
            </div>
            <button
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                    isAvailable ? 'bg-violet-600' : 'bg-slate-400 dark:bg-slate-600'
                }`}
                role="switch"
                aria-checked={isAvailable}
            >
                <span
                    aria-hidden="true"
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
}

const InvoiceHistory: React.FC<{jobs: Job[], onViewInvoice: (job: Job) => void}> = ({jobs, onViewInvoice}) => {
    const completedJobs = jobs.filter(j => j.status === 'Completed' && j.invoice);
    if (completedJobs.length === 0) return null;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div className="mt-8">
             <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Invoice History</h3>
             <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-blue-600 text-white text-left">
                        <tr>
                            <th className="p-3 font-semibold">Shop</th>
                            <th className="p-3 font-semibold">Date</th>
                            <th className="p-3 font-semibold text-right">Total</th>
                            <th className="p-3 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedJobs.map(job => (
                            <tr key={job.invoice!.id} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{job.shop.name}</td>
                                <td className="p-3 text-slate-600 dark:text-slate-400">{new Date(job.invoice!.date).toLocaleDateString()}</td>
                                <td className="p-3 font-semibold text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(job.invoice!.total)}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => onViewInvoice(job)} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onOpenSettings, shop, jobs, onUpdateShop, onViewInvoice }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-700/50 animate-in fade-in duration-300 card-interactive">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/50 border-2 border-violet-200 dark:border-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            {shop ? <BuildingStorefrontIcon className="h-12 w-12 text-violet-500 dark:text-violet-400" /> : <UserCircleIcon className="h-12 w-12 text-violet-500 dark:text-violet-400" />}
        </div>
        <div className="text-center">
             <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{shop ? shop.name : 'Profile & Settings'}</h1>
             {user && <p className="text-lg text-slate-500 dark:text-slate-400 break-all mt-2">{user.email}</p>}
             {shop && (
                <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>{shop.address}</p>
                    <p>{shop.phone}</p>
                </div>
             )}
        </div>
        
        {shop && onUpdateShop && (
            <>
                <div className="mt-6 flex justify-center">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                    >
                        Edit Shop Details
                    </button>
                </div>
                <AvailabilityToggle shop={shop} onUpdateShop={onUpdateShop} />
            </>
        )}
        {jobs && onViewInvoice && <InvoiceHistory jobs={jobs} onViewInvoice={onViewInvoice} />}
        
        <div className="mt-8 space-y-3">
            <button 
                onClick={onOpenSettings} 
                className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
                <Cog6ToothIcon className="h-5 w-5"/>
                App Settings
            </button>
            <button 
                onClick={onLogout} 
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-red-400 hover:to-pink-400 transition-all"
            >
                Logout
            </button>
        </div>
      </div>
    </div>
     {shop && onUpdateShop && isEditModalOpen && (
        <EditShopDetailsModal 
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            shop={shop}
            onSave={(updates) => onUpdateShop(updates)}
        />
    )}
    </>
  );
};