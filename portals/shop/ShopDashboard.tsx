
import React, { useState } from 'react';
import { Job, Shop, JobStatus } from '../../types';
import { PhotoIcon } from '../../components/icons/PhotoIcon';
import { CurrencyDollarIcon } from '../../components/icons/CurrencyDollarIcon';
import { WrenchScrewdriverIcon } from '../../components/icons/WrenchScrewdriverIcon';
import { ClipboardDocumentListIcon } from '../../components/icons/ClipboardDocumentListIcon';

interface ShopDashboardProps {
    jobs: Job[];
    onSelectJob: (job: Job) => void;
    shop: Shop;
}

const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    className: string;
    onClick: () => void;
    isActive: boolean;
}> = ({ title, value, icon, className, onClick, isActive }) => (
    <div
        onClick={onClick}
        className={`bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 flex items-center gap-4 cursor-pointer card-interactive group ${isActive ? 'ring-2 ring-violet-500' : 'ring-0 ring-transparent'}`}
    >
        <div className={`p-3 rounded-full ${className}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const JobStatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
    const statusStyles: { [key in JobStatus]: string } = {
        'New': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
        'Estimate': 'bg-teal-100 dark:bg-teal-700 text-teal-600 dark:text-teal-300',
        'Quote Requested': 'bg-cyan-100 dark:bg-cyan-700 text-cyan-600 dark:text-cyan-300',
        'Quote Provided': 'bg-violet-100 dark:bg-violet-700 text-violet-600 dark:text-violet-300',
        'Booking Confirmed': 'bg-amber-100 dark:bg-amber-700 text-amber-600 dark:text-amber-300',
        'In Repair': 'bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300',
        'Painting': 'bg-purple-100 dark:bg-purple-700 text-purple-600 dark:text-purple-300',
        'Final Check': 'bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-300',
        'Awaiting Payment': 'bg-orange-100 dark:bg-orange-700 text-orange-600 dark:text-orange-300',
        'Completed': 'bg-emerald-100 dark:bg-emerald-700 text-emerald-600 dark:text-emerald-300',
        'Cancelled': 'bg-red-100 dark:bg-red-700 text-red-600 dark:text-red-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full border border-transparent ${statusStyles[status] || statusStyles['New']}`}>
            {status}
        </span>
    );
}

export const ShopDashboard: React.FC<ShopDashboardProps> = ({ jobs, onSelectJob, shop }) => {
    const [activeFilter, setActiveFilter] = useState<'new' | 'in_progress' | 'completed' | 'all'>('all');

    const quoteRequestsCount = jobs.filter(j => j.status === 'New').length;
    const jobsInProgressCount = jobs.filter(j => ['In Repair', 'Painting', 'Final Check', 'Booking Confirmed'].includes(j.status)).length;
    const completedThisMonthCount = jobs.filter(j => {
        if (j.status !== 'Completed' || !j.lastUpdate) return false;
        const completionDate = new Date(j.lastUpdate);
        const today = new Date();
        return completionDate.getMonth() === today.getMonth() && completionDate.getFullYear() === today.getFullYear();
    }).length;

    const filteredJobs = jobs.filter(job => {
        switch (activeFilter) {
            case 'new':
                return job.status === 'New';
            case 'in_progress':
                return ['In Repair', 'Painting', 'Final Check', 'Booking Confirmed'].includes(job.status);
            case 'completed':
                return job.status === 'Completed';
            case 'all':
            default:
                return true;
        }
    }).sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());

    const tableTitles = {
        all: { title: 'All Recent Jobs', description: 'An overview of all jobs assigned to your shop.' },
        new: { title: 'New Quote Requests', description: 'Review new requests and provide quotes to customers.' },
        in_progress: { title: 'Jobs in Progress', description: 'Jobs that are currently being worked on.' },
        completed: { title: 'Completed Jobs', description: 'Jobs that have been completed.' },
    };

    const currentTitle = tableTitles[activeFilter];

    return (
        <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                 <StatCard 
                    title="All Jobs" 
                    value={jobs.length.toString()} 
                    icon={<ClipboardDocumentListIcon className="h-6 w-6 text-white"/>} 
                    className="bg-gradient-to-br from-slate-500 to-slate-600"
                    onClick={() => setActiveFilter('all')}
                    isActive={activeFilter === 'all'}
                />
                <StatCard 
                    title="New Quote Requests" 
                    value={quoteRequestsCount.toString()} 
                    icon={<PhotoIcon className="h-6 w-6 text-white"/>} 
                    className="bg-gradient-to-br from-cyan-500 to-blue-500" 
                    onClick={() => setActiveFilter('new')}
                    isActive={activeFilter === 'new'}
                />
                <StatCard 
                    title="Jobs in Progress" 
                    value={jobsInProgressCount.toString()} 
                    icon={<WrenchScrewdriverIcon className="h-6 w-6 text-white"/>} 
                    className="bg-gradient-to-br from-amber-500 to-orange-500" 
                    onClick={() => setActiveFilter('in_progress')}
                    isActive={activeFilter === 'in_progress'}
                />
                <StatCard 
                    title="Completed This Month" 
                    value={completedThisMonthCount.toString()} 
                    icon={<CurrencyDollarIcon className="h-6 w-6 text-white"/>} 
                    className="bg-gradient-to-br from-emerald-500 to-green-500" 
                    onClick={() => setActiveFilter('completed')}
                    isActive={activeFilter === 'completed'}
                />
            </div>

            <div className="mt-8 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentTitle.title}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{currentTitle.description}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Customer</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Vehicle</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Last Update</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length > 0 ? filteredJobs.map(job => (
                                <tr key={job.id} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{job.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">{job.carDetails ? `${job.carDetails.year} ${job.carDetails.make} ${job.carDetails.model}`: 'N/A'}</td>
                                    <td className="px-6 py-4"><JobStatusBadge status={job.status} /></td>
                                    <td className="px-6 py-4">{new Date(job.lastUpdate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onSelectJob(job)} className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors">
                                            {job.status === 'New' ? 'Create Quote' : 'Manage Job'}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-slate-500 dark:text-slate-500">
                                        No jobs match the selected filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};