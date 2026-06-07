
import React from 'react';
import { Job } from '../types';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';

interface InvoiceViewProps {
    job: Job;
    onPrint: (job: Job) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const InvoiceView: React.FC<InvoiceViewProps> = ({ job, onPrint }) => {
    const { invoice } = job;
    if (!invoice) return null;
    
    const handleEmail = () => {
        alert(`Invoice ${invoice.id} has been sent to ${job.customerEmail}. (Simulation)`);
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Invoice</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Invoice ID: {invoice.id}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Date: {new Date(invoice.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleEmail} className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors">
                        <EnvelopeIcon className="h-5 w-5"/>
                        <span>Email Invoice</span>
                    </button>
                    <button onClick={() => onPrint(job)} className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors">
                        <ArrowDownTrayIcon className="h-5 w-5"/>
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th scope="col" className="px-4 py-2 font-semibold text-left rounded-tl-lg">Description</th>
                            <th scope="col" className="px-4 py-2 text-center font-semibold">Qty</th>
                            <th scope="col" className="px-4 py-2 text-right font-semibold">Unit Price</th>
                            <th scope="col" className="px-4 py-2 text-right font-semibold rounded-tr-lg">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 dark:text-slate-300">
                        {invoice.items.map((item, index) => (
                            <tr key={index} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{item.description}</td>
                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                                <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Subtotal:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(invoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Tax (8%):</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(invoice.tax)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span>Total Due:</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">{formatCurrency(invoice.total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
