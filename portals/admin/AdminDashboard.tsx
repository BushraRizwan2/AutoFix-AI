
import React from 'react';
import { Shop, Job, JobStatus, AdminPage, ManagedUser } from '../../types';
import { UsersIcon } from '../../components/icons/UsersIcon';
import { BuildingStorefrontIcon } from '../../components/icons/BuildingStorefrontIcon';
import { CurrencyDollarIcon } from '../../components/icons/CurrencyDollarIcon';
import { PhotoIcon } from '../../components/icons/PhotoIcon';
import { ClockIcon } from '../../components/icons/ClockIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import { WrenchScrewdriverIcon } from '../../components/icons/WrenchScrewdriverIcon';
import { ArrowUpRightIcon } from '../../components/icons/ArrowUpRightIcon';
import { ArrowDownRightIcon } from '../../components/icons/ArrowDownRightIcon';

interface AdminDashboardProps {
    jobs: Job[];
    shops: Shop[];
    users: ManagedUser[];
    onNavigate: (page: AdminPage) => void;
    onSelectShop: (shop: Shop) => void;
}

// Re-usable component for each widget on the dashboard
const DashboardCard: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = '', style }) => (
    <div className={`bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-800/50 p-6 flex flex-col ${className}`} style={style}>
        {children}
    </div>
);

// Top-level Stat Card
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; className: string; onClick?: () => void; }> = ({ title, value, icon, className, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-5 flex items-center gap-4 transition-all duration-300 card-interactive ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className={`p-4 rounded-full ${className}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);


const BarChart: React.FC<{title: string, data: {label: string, value: number}[]}> = ({title, data}) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Current distribution of all jobs.</p>
            <div className="flex-grow h-64 overflow-x-auto pb-2">
                <div className="flex gap-x-3 sm:gap-x-4 items-end h-full min-w-[500px]">
                    {data.map((item, index) => (
                        <div key={item.label} className="flex-1 flex flex-col items-center justify-end gap-2 text-center" title={`${item.label}: ${item.value}`}>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.value}</p>
                             <div className="w-full bg-violet-500 rounded-t-md transition-all duration-500 hover:bg-violet-400" style={{height: `${(item.value / maxValue) * 80}%`, animation: `growUp 0.5s ${index * 50}ms ease-out forwards`}}>
                             </div>
                             <p className="text-xs text-slate-500 dark:text-slate-400 h-8 flex items-center justify-center text-center">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes growUp {
                    from { height: 0%; }
                    to { height: var(--final-height, 80%); }
                }
                .bar { animation: growUp 0.5s ease-out forwards; }
            `}</style>
        </>
    )
}

const LineChart: React.FC<{title: string, data: number[], labels: string[], total: string, change: number}> = ({title, data, labels, total, change}) => {
    const maxValue = Math.max(...data, 1);
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / maxValue) * 100}`).join(' ');
  
    return (
      <>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{total}</p>
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                {change >= 0 ? <ArrowUpRightIcon className="h-4 w-4"/> : <ArrowDownRightIcon className="h-4 w-4"/>}
                <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
        </div>
        <div className="flex-grow flex flex-col justify-end mt-4">
            <svg viewBox="0 0 100 100" className="w-full h-48" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="line-chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                    </linearGradient>
                </defs>
                <polyline fill="url(#line-chart-gradient)" points={`0,100 ${points} 100,100`} />
                <polyline fill="none" stroke="url(#line-chart-gradient)" strokeWidth="0.5" points={points} />
            </svg>
            <div className="flex justify-between flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
                {labels.map(l => <span key={l}>{l}</span>)}
            </div>
        </div>
      </>
    )
}

const ActivityFeed: React.FC<{ items: { icon: React.FC<any>, text: React.ReactNode, time: string }[] }> = ({ items }) => (
    <>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="flex-grow space-y-4 overflow-y-auto -mr-2 pr-2">
            {items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-800 dark:text-slate-200">{item.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </>
);

const PendingShopsList: React.FC<{shops: Shop[], onSelectShop: (shop: Shop) => void}> = ({shops, onSelectShop}) => (
    <>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Shops Awaiting Approval</h3>
        <div className="flex-grow space-y-3 overflow-y-auto -mr-2 pr-2">
            {shops.length > 0 ? shops.map(shop => (
                 <button key={shop.id} onClick={() => onSelectShop(shop)} className="w-full text-left p-3 rounded-lg flex items-center gap-3 bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700/70 transition-colors border border-slate-200 dark:border-slate-700">
                     <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <BuildingStorefrontIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{shop.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{shop.address}</p>
                    </div>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">&rarr;</span>
                 </button>
            )) : (
                <div className="h-full flex items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>No shops are currently pending approval. Great job!</p>
                </div>
            )}
        </div>
    </>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobs, shops, users, onNavigate, onSelectShop }) => {
    
    const totalUsers = users.length;
    const totalRevenue = jobs.reduce((sum, job) => sum + (job.invoice?.total || 0), 0);
    const pendingQuotes = jobs.filter(j => j.status === 'New' || j.status === 'Estimate').length;
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const jobsByStatusData = Object.entries(jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
    }, {} as Record<JobStatus, number>)).map(([label, value]) => ({label, value})).sort((a,b) => b.value - a.value);

    // Data for revenue chart
    const today = new Date();
    const revenueLabels: string[] = [];
    const revenueData: number[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        revenueLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        const dailyRevenue = jobs
            .filter(j => j.invoice && new Date(j.invoice.date).toDateString() === d.toDateString())
            .reduce((sum, j) => sum + (j.invoice?.total || 0), 0);
        revenueData.push(dailyRevenue);
    }
    const weeklyTotal = revenueData.reduce((a,b) => a+b, 0);
    const previousWeekTotal = jobs
        .filter(j => {
            if(!j.invoice) return false;
            const date = new Date(j.invoice.date);
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(new Date().getDate() - 14);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(new Date().getDate() - 7);
            return date > fourteenDaysAgo && date < sevenDaysAgo;
        })
        .reduce((sum, j) => sum + (j.invoice?.total || 0), 0);
    const revenueChange = previousWeekTotal > 0 ? ((weeklyTotal - previousWeekTotal) / previousWeekTotal) * 100 : (weeklyTotal > 0 ? 100 : 0);

    // Data for activity feed
    const timeSince = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const recentActivities = jobs
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 5)
        .map(job => {
            let icon = WrenchScrewdriverIcon;
            let text: React.ReactNode = <>New job <span className="font-semibold text-slate-900 dark:text-white">#{job.id.slice(-4)}</span> created for {job.carDetails.make}.</>;
            if (job.status === 'Completed') {
                icon = CheckCircleIcon;
                text = <>Job <span className="font-semibold text-slate-900 dark:text-white">#{job.id.slice(-4)}</span> was completed.</>;
            }
            return {
                icon,
                text,
                time: timeSince(new Date(job.lastUpdate))
            }
        });
    
    const pendingShops = shops.filter(s => s.status === 'Pending');

    return (
        <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                 <StatCard title="Total Users" value={totalUsers.toString()} icon={<UsersIcon className="h-6 w-6 text-white"/>} className="bg-gradient-to-br from-cyan-500 to-blue-500" onClick={() => onNavigate('users')} />
                 <StatCard title="Registered Shops" value={shops.length.toString()} icon={<BuildingStorefrontIcon className="h-6 w-6 text-white"/>} className="bg-gradient-to-br from-violet-500 to-purple-500" onClick={() => onNavigate('shops')} />
                 <StatCard title="New Quote Requests" value={pendingQuotes.toString()} icon={<PhotoIcon className="h-6 w-6 text-white"/>} className="bg-gradient-to-br from-amber-500 to-orange-500" />
                 <StatCard title="Platform Revenue" value={formatCurrency(totalRevenue)} icon={<CurrencyDollarIcon className="h-6 w-6 text-white"/>} className="bg-gradient-to-br from-emerald-500 to-green-500" onClick={() => onNavigate('transactions')} />
            </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                 <DashboardCard className="card-interactive animate-in fade-in duration-500" style={{animationDelay: '100ms'}}><BarChart title="Jobs by Status" data={jobsByStatusData.slice(0, 7)} /></DashboardCard>
                 <DashboardCard className="card-interactive animate-in fade-in duration-500" style={{animationDelay: '200ms'}}><LineChart title="Revenue (Last 7 Days)" data={revenueData} labels={revenueLabels} total={formatCurrency(weeklyTotal)} change={revenueChange} /></DashboardCard>
                 <DashboardCard className="card-interactive animate-in fade-in duration-500" style={{animationDelay: '300ms'}}><ActivityFeed items={recentActivities} /></DashboardCard>
                 <DashboardCard className="card-interactive animate-in fade-in duration-500" style={{animationDelay: '400ms'}}><PendingShopsList shops={pendingShops} onSelectShop={onSelectShop} /></DashboardCard>
            </div>
        </div>
    );
};