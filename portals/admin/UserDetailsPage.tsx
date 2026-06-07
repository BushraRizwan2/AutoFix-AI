
import React from 'react';
import { Job, ManagedUser } from '../../types';
import { ManagementTable } from './ManagementTable';
import { UserCircleIcon } from '../../components/icons/UserCircleIcon';

interface UserDetailsPageProps {
  user: ManagedUser;
  jobs: Job[];
  onBack: () => void;
}

export const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ user, jobs, onBack }) => {
    
    const jobColumns = [
        { header: 'Job ID', accessor: 'id' },
        { header: 'Shop', accessor: 'shopName' },
        { header: 'Status', accessor: 'status' },
        { header: 'Date', accessor: 'lastUpdate' },
    ];

    const jobData = jobs.map(j => ({
        ...j,
        shopName: j.shop.name,
        lastUpdate: new Date(j.lastUpdate).toLocaleDateString(),
    }));

    return (
        <div className="animate-in fade-in duration-300">
             <button onClick={onBack} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors mb-4">
                &larr; Back to all users
            </button>

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-8 mb-8">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCircleIcon className="h-12 w-12 text-violet-500 dark:text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white break-all">{user.email}</h1>
                        <p className="mt-1 text-slate-500 dark:text-slate-400 capitalize">Role: {user.role}</p>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">Total Jobs: {user.jobCount}</p>
                    </div>
                </div>
            </div>
            
            <ManagementTable 
                title="Job History"
                description={`A list of all jobs associated with ${user.email}.`}
                columns={jobColumns}
                data={jobData}
                onManageClick={(job) => alert(`Viewing details for Job ID: ${job.id}`)}
            />
        </div>
    );
};
