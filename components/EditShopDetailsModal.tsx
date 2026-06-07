
import React, { useState } from 'react';
import { Shop } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';

interface EditShopDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  onSave: (updates: Partial<Shop>) => void;
}

export const EditShopDetailsModal: React.FC<EditShopDetailsModalProps> = ({ isOpen, onClose, shop, onSave }) => {
  const [name, setName] = useState(shop.name);
  const [address, setAddress] = useState(shop.address);
  const [phone, setPhone] = useState(shop.phone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, address, phone });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-lg m-4 p-8 border border-slate-200 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/50 border-2 border-violet-200 dark:border-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <BuildingStorefrontIcon className="h-8 w-8 text-violet-500 dark:text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Shop Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shop Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
          </div>

          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 rounded-lg">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
