
import React from 'react';
import { Job } from '../../types';

interface EarningsPageProps {
  jobs: Job[];
}

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    </div>
);

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const EarningsPage: React.FC<EarningsPageProps> = ({ jobs }) => {
    const completedJobs = jobs.filter(j => j.status === 'Completed' && j.invoice);
    const totalRevenue = completedJobs.reduce((acc, job) => acc + job.invoice!.total, 0);
    const jobsPaid = completedJobs.length;

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Earnings</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Track your revenue and view transaction history.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} />
                <StatCard title="Total Paid Jobs" value={jobsPaid.toString()} />
            </div>

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transaction History</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A log of all completed and paid invoices.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Invoice ID</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Customer</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Date Paid</th>
                                <th scope="col" className="px-6 py-3 text-right font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedJobs.length > 0 ? completedJobs.map(({ id, invoice, customerEmail }) => (
                                <tr key={id} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{invoice!.id}</td>
                                    <td className="px-6 py-4">{customerEmail}</td>
                                    <td className="px-6 py-4">{new Date(invoice!.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(invoice!.total)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-slate-500">
                                        No paid jobs yet.
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
