import React, { useState, useEffect } from 'react';
import { ShopService } from '../../types';
import { XMarkIcon } from '../../components/icons/XMarkIcon';
import { CurrencyDollarIcon } from '../../components/icons/CurrencyDollarIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';

interface ServicesManagementPageProps {
  services: ShopService[];
  onUpdateServices: (services: ShopService[]) => void;
}

const emptyService: Omit<ShopService, 'id'> = { name: '', price: 0, duration: 0 };

export const ServicesManagementPage: React.FC<ServicesManagementPageProps> = ({ services, onUpdateServices }) => {
    const [serviceToEdit, setServiceToEdit] = useState<ShopService | Omit<ShopService, 'id'>> (emptyService);
    const [editingId, setEditingId] = useState<string | null>(null);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceToEdit.name.trim() || serviceToEdit.price <= 0) return;

        if (editingId) {
            // Update existing service
            const updatedServices = services.map(s => s.id === editingId ? { ...s, ...serviceToEdit } : s);
            onUpdateServices(updatedServices);
        } else {
            // Add new service
            const serviceToAdd: ShopService = {
                ...serviceToEdit,
                id: `service-${Date.now()}`,
            };
            onUpdateServices([...services, serviceToAdd]);
        }
        
        setServiceToEdit(emptyService);
        setEditingId(null);
    };
    
    const handleRemoveService = (id: string) => {
        if (editingId === id) { // If deleting the service being edited, cancel edit mode
            setEditingId(null);
            setServiceToEdit(emptyService);
        }
        onUpdateServices(services.filter(s => s.id !== id));
    };
    
    const startEditing = (service: ShopService) => {
        setEditingId(service.id);
        setServiceToEdit(service);
    };
    
    const cancelEditing = () => {
        setEditingId(null);
        setServiceToEdit(emptyService);
    };

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Services & Pricing</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Manage the services your shop offers.
                </p>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-semibold">Service Name</th>
                                    <th scope="col" className="px-6 py-3 font-semibold">Price</th>
                                    <th scope="col" className="px-6 py-3 font-semibold">Duration</th>
                                    <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length > 0 ? services.map(service => (
                                    <tr key={service.id} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">{service.name}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{formatCurrency(service.price)}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{service.duration} hours</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => startEditing(service)} className="text-slate-500 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleRemoveService(service.id)} className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center p-8 text-slate-500">
                                            No services defined yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 h-fit">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Service Name</label>
                            <input type="text" value={serviceToEdit.name} onChange={(e) => setServiceToEdit({...serviceToEdit, name: e.target.value})} required className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                        </div>
                        <div className="flex gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price ($)</label>
                                <input type="number" value={serviceToEdit.price} onChange={(e) => setServiceToEdit({...serviceToEdit, price: parseFloat(e.target.value)})} required min="0" step="0.01" className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Duration (hrs)</label>
                                <input type="number" value={serviceToEdit.duration} onChange={(e) => setServiceToEdit({...serviceToEdit, duration: parseInt(e.target.value)})} required min="0" className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {editingId && (
                                <button type="button" onClick={cancelEditing} className="w-full bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg">
                                    Cancel
                                </button>
                            )}
                            <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg">
                                {editingId ? 'Update Service' : 'Add Service'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
