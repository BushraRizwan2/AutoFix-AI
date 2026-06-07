
import React from 'react';

interface Column {
  header: string;
  accessor: string;
}

interface ManagementTableProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  onManageClick?: (item: any) => void;
}

export const ManagementTable: React.FC<ManagementTableProps> = ({ title, description, columns, data, onManageClick }) => {
    
    const renderCell = (item: any, accessor: string) => {
        const value = item[accessor];
        if (accessor === 'status') {
             const statusStyles: { [key: string]: string } = {
                // Job Statuses
                'New': 'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-500/20',
                'Estimate': 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/20',
                'Quote Requested': 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20',
                'Quote Provided': 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20',
                'Booking Confirmed': 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
                'In Repair': 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
                'Awaiting Payment': 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
                'Completed': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
                'Cancelled': 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
                // Shop Statuses
                'Approved': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
                'Pending': 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
                'Suspended': 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
             };
             const style = statusStyles[value] || 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-500/20';

             return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${style}`}>{value}</span>
            );
        }
        if (accessor === 'name' || accessor === 'email' || accessor === 'carDetails' || accessor === 'shopName') {
            return <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{value}</div>;
        }
        return value;
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden animate-in fade-in duration-500 h-full flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
            </div>
            <div className="overflow-x-auto flex-grow">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            {columns.map(col => <th key={col.accessor} scope="col" className="px-6 py-3 font-semibold text-left">{col.header}</th>)}
                            {onManageClick && <th scope="col" className="px-6 py-3 text-right font-semibold">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((item, index) => (
                            <tr key={item.id || index} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                {columns.map(col => (
                                    <td key={col.accessor} className="px-6 py-4">
                                        {renderCell(item, col.accessor)}
                                    </td>
                                ))}
                                {onManageClick && (
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => onManageClick(item)} 
                                            className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length + (onManageClick ? 1 : 0)} className="text-center p-8 text-slate-500">
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
