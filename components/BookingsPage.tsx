
import React from 'react';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { Job, JobStatus } from '../types';
import { CarIcon } from './icons/CarIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface BookingsPageProps {
    jobs: Job[];
    onSelectJob: (jobId: string) => void;
    onNewQuote: () => void;
}

const JobStatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
    const statusStyles: { [key in JobStatus]: string } = {
        'New': 'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-500/20',
        'Estimate': 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/20',
        'Quote Requested': 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20',
        'Quote Provided': 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20',
        'Booking Confirmed': 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
        'In Repair': 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
        'Painting': 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
        'Final Check': 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
        'Awaiting Payment': 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
        'Completed': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        'Cancelled': 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusStyles[status]}`}>
            {status}
        </span>
    );
}

const JobCard: React.FC<{ job: Job, onSelectJob: (jobId: string) => void }> = ({ job, onSelectJob }) => {
    const { carDetails, shop } = job;
    return (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden card-interactive hover:border-violet-400 dark:hover:border-violet-500/50">
            <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"><BuildingStorefrontIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" /></div>
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white">{shop.name}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 pl-1">
                             <CarIcon className="h-5 w-5" />
                             <span>{`${carDetails.year} ${carDetails.make} ${carDetails.model}`}</span>
                        </div>
                         <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 ml-9 truncate">Job ID: {job.id}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
                        <JobStatusBadge status={job.status} />
                        {job.bookingDate && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                               <CalendarDaysIcon className="h-4 w-4" />
                               <span>Booked for: <span className="font-semibold text-slate-700 dark:text-slate-300">{job.bookingDate}</span></span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/70 px-5 py-3 text-right border-t border-slate-200 dark:border-slate-800">
                <button 
                    onClick={() => onSelectJob(job.id)} 
                    className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
                >
                    View Details & Chat &rarr;
                </button>
            </div>
        </div>
    );
};


export const BookingsPage: React.FC<BookingsPageProps> = ({ jobs, onSelectJob, onNewQuote }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                View your quote requests and service appointments.
            </p>
        </div>
        <button onClick={onNewQuote} className="flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-3 sm:px-6 sm:py-3 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-xl hover:scale-105">
            <PlusCircleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Request a New Quote</span>
        </button>
      </div>
      
      {jobs.length > 0 ? (
        <div className="space-y-6">
            {jobs.map(job => <JobCard key={job.id} job={job} onSelectJob={onSelectJob} />)}
        </div>
      ) : (
        <div className="text-center bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl p-8 md:p-16 border border-slate-200 dark:border-slate-700/50">
            <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/50 border-2 border-violet-200 dark:border-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CalendarDaysIcon className="h-10 w-10 text-violet-500 dark:text-violet-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">No active bookings yet.</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6 max-w-sm mx-auto">Ready to get started on a repair? Our trusted partners are waiting for you.</p>
            <button 
                onClick={onNewQuote} 
                className="flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-3 sm:px-6 sm:py-3 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                title="Get a Free Quote Now"
            >
                <PlusCircleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Get a Free Quote Now</span>
                <span className="sm:hidden">Get Quote</span>
            </button>
        </div>
      )}
    </div>
  );
};