
import React from 'react';
import { Job, Shop, User, AdminPage, JobStatus } from '../../types';

interface AnalyticsPageProps {
  jobs: Job[];
  shops: Shop[];
  users: Partial<User & { jobCount: number }>[];
  onNavigate: (page: AdminPage) => void;
}

const StatCard: React.FC<{ title: string; value: string; onClick?: () => void; }> = ({ title, value, onClick }) => (
    <button 
        onClick={onClick}
        disabled={!onClick}
        className="group bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-5 text-left transition-all duration-300 card-interactive disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:shadow-lg"
    >
        <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    </button>
);

const BarChart: React.FC<{title: string, data: {label: string, value: number, isCurrency?: boolean}[]}> = ({title, data}) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const formatValue = (value: number, isCurrency?: boolean) => {
        if (isCurrency) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
        }
        return value.toString();
    }
    
    return (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 flex flex-col min-h-[300px]">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
            <div className="flex-grow overflow-x-auto pb-4 -mb-4 -mr-4 pr-4">
                <div className="flex gap-4 items-end h-full min-w-[500px]">
                    {data.map((item, index) => (
                        <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group" title={`${item.label}: ${formatValue(item.value, item.isCurrency)}`}>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors group-hover:text-violet-500 dark:group-hover:text-violet-400">{formatValue(item.value, item.isCurrency)}</p>
                            <div 
                                className="w-full bg-gradient-to-t from-violet-500/70 to-indigo-500/70 dark:from-violet-600/70 dark:to-indigo-600/70 rounded-t-md transition-all duration-300 group-hover:from-violet-500 group-hover:to-indigo-500" 
                                style={{
                                    height: `${(item.value / maxValue) * 100}%`,
                                    animation: `grow-bar 0.5s ${index * 50}ms ease-out forwards`,
                                    transformOrigin: 'bottom'
                                }}
                            ></div>
                            <p className="text-xs text-slate-500 dark:text-slate-500 text-center h-8 leading-tight">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
             <style>
                {`@keyframes grow-bar { from { transform: scaleY(0); } to { transform: scaleY(1); } }`}
            </style>
        </div>
    )
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ jobs, shops, users, onNavigate }) => {
    const totalRevenue = jobs.reduce((acc, job) => acc + (job.invoice?.total || 0), 0);
    
    const allJobStatuses: JobStatus[] = ['New', 'Estimate', 'Quote Provided', 'Booking Confirmed', 'In Repair', 'Painting', 'Final Check', 'Awaiting Payment', 'Completed', 'Cancelled'];

    const jobsByStatusData = allJobStatuses.map(status => ({
        label: status,
        value: jobs.filter(job => job.status === status).length
    })).filter(item => item.value > 0);

    const revenueByShopData = shops.map(shop => ({
        label: shop.name,
        value: jobs.filter(j => j.shop.id === shop.id).reduce((acc, job) => acc + (job.invoice?.total || 0), 0),
        isCurrency: true
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 10); // Top 10 shops

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Platform Analytics</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Deep dive into your platform's performance metrics.
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 animate-in fade-in-20 slide-in-from-bottom-5 duration-500">
                <StatCard title="Total Revenue" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue)} onClick={() => onNavigate('transactions')} />
                <StatCard title="Total Jobs" value={jobs.length.toString()} />
                <StatCard title="Total Shops" value={shops.length.toString()} onClick={() => onNavigate('shops')} />
                <StatCard title="Total Customers" value={users.length.toString()} onClick={() => onNavigate('users')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in-20 slide-in-from-bottom-5 duration-500 delay-200">
                <BarChart title="Jobs by Status" data={jobsByStatusData} />
                <BarChart title="Top Shops by Revenue" data={revenueByShopData} />
            </div>
        </div>
    );
};