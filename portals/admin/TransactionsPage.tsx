
import React from 'react';
import { Job } from '../../types';

interface TransactionsPageProps {
  jobs: Job[];
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ jobs }) => {
    const transactions = jobs
        .filter(j => j.status === 'Completed' && j.invoice)
        .map(j => ({ ...j.invoice!, job: j }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">All Transactions</h1>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        A log of all completed payments on the platform.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Platform Revenue</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalRevenue)}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Invoice ID</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Date</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Shop</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Customer</th>
                                <th scope="col" className="px-6 py-3 text-right font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? transactions.map(t => (
                                <tr key={t.id} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{t.id}</td>
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{t.job.shop.name}</td>
                                    <td className="px-6 py-4">{t.job.customerEmail}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(t.total)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-slate-500">
                                        No transactions found.
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
