
import React, { useState, useEffect } from 'react';
import { InventoryPart } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { CubeIcon } from './icons/CubeIcon';

interface AddPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (part: InventoryPart) => void;
  partToEdit: InventoryPart | null;
}

export const AddPartModal: React.FC<AddPartModalProps> = ({ isOpen, onClose, onSave, partToEdit }) => {
  const [part, setPart] = useState<Omit<InventoryPart, 'id'>>({
    name: '', supplier: '', stock: 0, price: 0
  });

  useEffect(() => {
    if (partToEdit) {
      setPart(partToEdit);
    } else {
      setPart({ name: '', supplier: '', stock: 0, price: 0 });
    }
  }, [partToEdit]);

  const handleChange = (field: keyof typeof part, value: string | number) => {
    setPart(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!part.name) return;
    const finalPart: InventoryPart = {
        ...part,
        id: partToEdit?.id || `inv-${Date.now()}`,
    };
    onSave(finalPart);
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
            <CubeIcon className="h-8 w-8 text-violet-500 dark:text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{partToEdit ? 'Edit Inventory Part' : 'Add New Part to Inventory'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Part Name</label>
            <input type="text" value={part.name} onChange={(e) => handleChange('name', e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Supplier</label>
            <input type="text" value={part.supplier} onChange={(e) => handleChange('supplier', e.target.value)} className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Quantity</label>
                <input type="number" value={part.stock} onChange={(e) => handleChange('stock', Number(e.target.value))} required min="0" className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                <input type="number" value={part.price} onChange={(e) => handleChange('price', Number(e.target.value))} required min="0" step="0.01" className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
            </div>
          </div>
          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 rounded-lg">
            {partToEdit ? 'Save Changes' : 'Add Part'}
          </button>
        </form>
      </div>
    </div>
  );
};
