
import React from 'react';
import { Job, JobStatus } from '../../types';

interface WorkflowPageProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onUpdateJobStatus: (jobId: string, status: JobStatus) => void;
}

const statusColumns: JobStatus[] = ['Booking Confirmed', 'In Repair', 'Painting', 'Final Check', 'Awaiting Payment'];
const statusColors: { [key in JobStatus]: string } = {
    'Booking Confirmed': 'border-amber-400 dark:border-amber-500/50',
    'In Repair': 'border-blue-400 dark:border-blue-500/50',
    'Painting': 'border-purple-400 dark:border-purple-500/50',
    'Final Check': 'border-teal-400 dark:border-teal-500/50',
    'Awaiting Payment': 'border-orange-400 dark:border-orange-500/50',
    'New': '', 'Estimate': '', 'Quote Requested': '', 'Quote Provided': '', 'Completed': '', 'Cancelled': '' // Not used in columns
};


const JobCard: React.FC<{ job: Job, onSelectJob: (job: Job) => void }> = ({ job, onSelectJob }) => (
    <div
        onClick={() => onSelectJob(job)}
        className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md"
    >
        <p className="font-semibold text-slate-800 dark:text-white text-sm">{`${job.carDetails.year} ${job.carDetails.make} ${job.carDetails.model}`}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Customer: {job.clientDetails?.name || job.customerEmail}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">ID: {job.id}</p>
    </div>
);

export const WorkflowPage: React.FC<WorkflowPageProps> = ({ jobs, onSelectJob, onUpdateJobStatus }) => {

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Job Workflow</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Visualize and manage your shop's entire job pipeline.
                </p>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4">
                {statusColumns.map(status => (
                    <div key={status} className={`w-72 flex-shrink-0 bg-slate-100 dark:bg-slate-900/50 rounded-xl border-t-4 ${statusColors[status]}`}>
                        <h3 className="p-4 font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800">{status}</h3>
                        <div className="p-4 space-y-4 h-full">
                            {jobs.filter(job => job.status === status).map(job => (
                                <JobCard key={job.id} job={job} onSelectJob={onSelectJob} />
                            ))}
                            {jobs.filter(job => job.status === status).length === 0 && (
                                <div className="text-center text-sm text-slate-400 dark:text-slate-500 pt-8">No jobs in this stage.</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
