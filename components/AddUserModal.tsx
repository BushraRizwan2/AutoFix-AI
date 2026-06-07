
import React, { useState } from 'react';
import { User, Shop, UserType } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: Omit<User, 'role'>) => void;
  shops: Shop[];
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser, shops }) => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('Standard');
  const [primaryShopId, setPrimaryShopId] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (userType === 'Business' && !primaryShopId) {
        setError('Please select a primary shop for Business customers.');
        return;
    }
    setError('');
    onAddUser({ email, userType, primaryShopId: userType === 'Business' ? primaryShopId : undefined });
  };
  
  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setEmail('');
        setUserType('Standard');
        setPrimaryShopId(undefined);
        setError('');
    }, 300);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 border border-slate-200 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/50 border-2 border-violet-200 dark:border-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlusIcon className="h-8 w-8 text-violet-500 dark:text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New User</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Add a new standard or business customer.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">User Email</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 p-2.5 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">User Type</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <BriefcaseIcon className="h-5 w-5 text-slate-400" />
              </div>
              <select id="userType" value={userType} onChange={(e) => setUserType(e.target.value as UserType)} className="w-full pl-10 p-2.5 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white appearance-none" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                <option value="Standard">Standard</option>
                <option value="Business">Business</option>
              </select>
            </div>
          </div>

          {userType === 'Business' && (
            <div className="animate-in fade-in duration-300">
                <label htmlFor="primaryShop" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Shop</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <BuildingStorefrontIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <select id="primaryShop" value={primaryShopId || ''} onChange={(e) => setPrimaryShopId(Number(e.target.value))} required className="w-full pl-10 p-2.5 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white appearance-none" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                        <option value="" disabled>Select a shop</option>
                        {shops.map(shop => (
                            <option key={shop.id} value={shop.id}>{shop.name}</option>
                        ))}
                    </select>
                </div>
            </div>
          )}

          {error && (
            <p className="mt-2 text-sm text-center text-red-500/80">{error}</p>
          )}

          <button type="submit" className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg">
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};
