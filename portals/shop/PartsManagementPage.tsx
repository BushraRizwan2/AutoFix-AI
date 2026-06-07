
import React, { useState, useMemo } from 'react';
import { Job, Shop, Part, InventoryPart } from '../../types';
import { AddPartModal } from '../../components/AddPartModal';
import { CubeIcon } from '../../components/icons/CubeIcon';
import { WrenchScrewdriverIcon } from '../../components/icons/WrenchScrewdriverIcon';
import { PlusCircleIcon } from '../../components/icons/PlusCircleIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { XMarkIcon } from '../../components/icons/XMarkIcon';

interface PartsManagementPageProps {
  shop: Shop;
  jobs: Job[];
  onUpdateShop: (updates: Partial<Shop>) => void;
}

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; icon: React.FC<any>; label: string }> = ({ isActive, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isActive 
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' 
            : 'text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700/70 hover:text-slate-800 dark:hover:text-white'
        }`}
    >
        <Icon className="h-5 w-5" />
        <span className="hidden sm:inline">{label}</span>
    </button>
);


export const PartsManagementPage: React.FC<PartsManagementPageProps> = ({ shop, jobs, onUpdateShop }) => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'inventory'>('jobs');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [partToEdit, setPartToEdit] = useState<InventoryPart | null>(null);

    const partsForJobs = useMemo(() => {
        const allParts: (Part & { jobId: string })[] = [];
        jobs.forEach(job => {
            if (job.parts) {
                job.parts.forEach(part => {
                    allParts.push({ ...part, jobId: job.id });
                });
            }
        });
        return allParts;
    }, [jobs]);

    const handleSavePart = (part: InventoryPart) => {
        const existingPart = shop.inventory.find(p => p.id === part.id);
        let newInventory: InventoryPart[];
        if (existingPart) {
            newInventory = shop.inventory.map(p => p.id === part.id ? part : p);
        } else {
            newInventory = [...shop.inventory, part];
        }
        onUpdateShop({ inventory: newInventory });
    };

    const handleRemovePart = (partId: string) => {
        onUpdateShop({ inventory: shop.inventory.filter(p => p.id !== partId) });
    };

    const openAddModal = () => {
        setPartToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (part: InventoryPart) => {
        setPartToEdit(part);
        setIsModalOpen(true);
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Parts Management</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Track parts needed for jobs and manage your shop's inventory.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
                <TabButton isActive={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={WrenchScrewdriverIcon} label="Parts for Jobs" />
                <TabButton isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={CubeIcon} label="Shop Inventory" />
            </div>

            {activeTab === 'jobs' && (
                 <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-blue-600 text-white text-left">
                                <tr>
                                    <th className="p-3 font-semibold">Part Name</th>
                                    <th className="p-3 font-semibold">Job ID</th>
                                    <th className="p-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partsForJobs.map(part => (
                                     <tr key={`${part.jobId}-${part.id}`} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                         <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{part.name}</td>
                                         <td className="p-3 text-slate-600 dark:text-slate-400">{part.jobId}</td>
                                         <td className="p-3 text-slate-600 dark:text-slate-400">{part.status}</td>
                                     </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'inventory' && (
                 <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                     <div className="p-4 flex justify-between items-center">
                         <h3 className="text-lg font-semibold">Your Inventory</h3>
                         <button onClick={openAddModal} className="flex items-center gap-2 text-sm font-semibold bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 p-1.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-500/20">
                            <PlusCircleIcon className="h-5 w-5"/>
                            <span className="hidden sm:inline">Add Part</span>
                         </button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-blue-600 text-white text-left">
                                <tr>
                                    <th className="p-3 font-semibold">Part Name</th>
                                    <th className="p-3 font-semibold">Supplier</th>
                                    <th className="p-3 font-semibold">Stock</th>
                                    <th className="p-3 font-semibold">Price</th>
                                    <th className="p-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shop.inventory.map(part => (
                                     <tr key={part.id} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                         <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{part.name}</td>
                                         <td className="p-3 text-slate-600 dark:text-slate-400">{part.supplier}</td>
                                         <td className="p-3 text-slate-600 dark:text-slate-400">{part.stock}</td>
                                         <td className="p-3 text-slate-600 dark:text-slate-400">{formatCurrency(part.price)}</td>
                                         <td className="p-3 text-right">
                                             <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(part)} className="text-slate-500 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleRemovePart(part.id)} className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                         </td>
                                     </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <AddPartModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSavePart}
                    partToEdit={partToEdit}
                />
            )}
        </div>
    );
};
