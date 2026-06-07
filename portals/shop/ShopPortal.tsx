
import React, { useState } from 'react';
import { User, Job, Shop, ShopPage, ClientDetails, StaffMember, Part, ManualQuote, ShopService, AppSettings, JobStatus } from '../../types';
import { ShopDashboard } from './ShopDashboard';
import { ShopJobDetails } from './ShopJobDetails';
import { Layout } from '../../components/Layout';
import { shopNavItems } from '../../navConfig';
import { ProfilePage } from '../../components/ProfilePage';
import { ManagementTable } from '../admin/ManagementTable';
import { WorkflowPage } from './WorkflowPage';
import { StaffRecordManagementPage } from './StaffRecordManagementPage';
import { ServicesManagementPage } from './ServicesManagementPage';
import { EarningsPage } from './EarningsPage';
import { SettingsModal } from '../../components/SettingsModal';
import { MagnifyingGlassIcon } from '../../components/icons/MagnifyingGlassIcon';
import { PartsManagementPage } from './PartsManagementPage';
import { CalendarPage } from './CalendarPage';

interface ShopPortalProps {
    user: User;
    onLogout: () => void;
    jobs: Job[];
    shop: Shop;
    onProvideQuote: (jobId: string, quote: ManualQuote) => void;
    onSendChatMessage: (jobId: string, message: string) => void;
    onUpdateJobStatus: (jobId: string, status: Job['status']) => void;
    onGenerateInvoice: (jobId: string) => void;
    onUpdateShop: (updates: Partial<Shop>) => void;
    onUpdateClientDetails: (jobId: string, details: ClientDetails) => void;
    onUpdatePhotos: (jobId: string, category: 'damage' | 'inProgress' | 'completed', photos: string[]) => void;
    onUpdateStaff: (jobId: string, staff: StaffMember[]) => void;
    onUpdateParts: (jobId: string, parts: Part[]) => void;
    onUpdateNotes: (jobId: string, notes: string) => void;
    onUpdateJobBookingDate: (jobId: string, date: string) => void;
    settings: AppSettings;
    onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const ShopPortal: React.FC<ShopPortalProps> = (props) => {
    const [activePage, setActivePage] = useState<ShopPage>('dashboard'); 
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');

    const handleSelectJob = (job: Job) => {
        setSelectedJob(job);
        setActivePage('jobs'); // Set active page to 'jobs' when viewing details for breadcrumb consistency
    };
    
    const handleBack = () => {
        setSelectedJob(null);
    };

    const handleNavigate = (page: ShopPage) => {
        setActivePage(page);
        setSelectedJob(null); 
    };
    
    const handleUpdateShopServices = (services: ShopService[]) => {
        props.onUpdateShop({ services });
    };

    const handleUpdateShopStaff = (staff: StaffMember[]) => {
        props.onUpdateShop({ staff });
    };

    const renderPage = () => {
        if (selectedJob) {
            return <ShopJobDetails 
                        job={selectedJob} 
                        allStaff={props.shop.staff}
                        onBack={handleBack}
                        onSendMessage={(msg) => props.onSendChatMessage(selectedJob.id, msg)}
                        onUpdateStatus={(status) => props.onUpdateJobStatus(selectedJob.id, status)}
                        onUpdateClientDetails={(details) => props.onUpdateClientDetails(selectedJob.id, details)}
                        onUpdatePhotos={(category, photos) => props.onUpdatePhotos(selectedJob.id, category, photos)}
                        onUpdateStaff={(staff) => props.onUpdateStaff(selectedJob.id, staff)}
                        onUpdateParts={(parts) => props.onUpdateParts(selectedJob.id, parts)}
                        onUpdateNotes={(notes) => props.onUpdateNotes(selectedJob.id, notes)}
                        onProvideQuote={(quote) => props.onProvideQuote(selectedJob.id, quote)}
                        onGenerateInvoice={() => props.onGenerateInvoice(selectedJob.id)}
                   />;
        }

        switch (activePage) {
            case 'dashboard':
                return <ShopDashboard jobs={props.jobs} onSelectJob={handleSelectJob} shop={props.shop} />;
            case 'workflow':
                return <WorkflowPage jobs={props.jobs} onSelectJob={handleSelectJob} onUpdateJobStatus={props.onUpdateJobStatus} />;
            case 'jobs': {
                 const jobColumns = [
                    { header: 'Customer', accessor: 'customerEmail' },
                    { header: 'Vehicle', accessor: 'carDetails' },
                    { header: 'Status', accessor: 'status' },
                 ];
                 const allStatuses: JobStatus[] = ['New', 'Estimate', 'Quote Requested', 'Quote Provided', 'Booking Confirmed', 'In Repair', 'Painting', 'Final Check', 'Awaiting Payment', 'Completed', 'Cancelled'];

                 const filteredJobs = props.jobs.filter(job => {
                    const lowerSearchTerm = searchTerm.toLowerCase();
                    const matchesSearch = searchTerm === '' ||
                        job.customerEmail.toLowerCase().includes(lowerSearchTerm) ||
                        `${job.carDetails.year} ${job.carDetails.make} ${job.carDetails.model}`.toLowerCase().includes(lowerSearchTerm);
                    
                    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
                    
                    return matchesSearch && matchesStatus;
                }).sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());

                 const jobData = filteredJobs.map(j => ({
                     ...j,
                     carDetails: `${j.carDetails.year} ${j.carDetails.make} ${j.carDetails.model}`
                 }));
                 return (
                    <div className="animate-in fade-in duration-300">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">All Jobs</h1>
                            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                                Search and filter all jobs assigned to your shop.
                            </p>
                        </div>
                        
                        {/* Filter Bar */}
                        <div className="mb-6 p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-grow w-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by customer email or vehicle..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="relative w-full md:w-auto">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as (JobStatus | 'all'))}
                                    className="w-full md:w-52 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition text-slate-900 dark:text-white appearance-none pr-8"
                                    style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                                >
                                    <option value="all">All Statuses</option>
                                    {allStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                className="w-full md:w-auto px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition whitespace-nowrap"
                            >
                                Clear Filters
                            </button>
                        </div>
                
                        <ManagementTable 
                            title={`${filteredJobs.length} Jobs Found`}
                            description="Manage individual jobs by clicking the 'Manage' button."
                            columns={jobColumns}
                            data={jobData}
                            onManageClick={(item) => handleSelectJob(item as Job)}
                        />
                    </div>
                 )
            }
             case 'staff':
                return <StaffRecordManagementPage staff={props.shop.staff} onUpdateStaff={handleUpdateShopStaff} />;
            case 'services':
                return <ServicesManagementPage services={props.shop.services} onUpdateServices={handleUpdateShopServices} />;
             case 'parts':
                return <PartsManagementPage 
                    shop={props.shop} 
                    jobs={props.jobs} 
                    onUpdateShop={props.onUpdateShop} 
                />;
            case 'earnings':
                return <EarningsPage jobs={props.jobs} />;
            case 'calendar':
                return (
                    <CalendarPage
                        jobs={props.jobs}
                        shop={props.shop}
                        onSelectJob={handleSelectJob}
                        onUpdateBookingDate={props.onUpdateJobBookingDate}
                        onUpdateStaff={props.onUpdateStaff}
                        onUpdateStatus={props.onUpdateJobStatus}
                    />
                );
            case 'profile':
                return <ProfilePage user={props.user} onLogout={props.onLogout} shop={props.shop} onUpdateShop={props.onUpdateShop} onOpenSettings={() => setIsSettingsModalOpen(true)} />;
            default:
                return <ShopDashboard jobs={props.jobs} onSelectJob={handleSelectJob} shop={props.shop} />;
        }
    }

    return (
        <>
            <Layout
                user={props.user}
                onLogout={props.onLogout}
                navItems={shopNavItems}
                activePage={activePage}
                onNavigate={handleNavigate as (page: any) => void}
                title={props.shop.name}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
            >
                {renderPage()}
            </Layout>
            {isSettingsModalOpen && (
                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    settings={props.settings}
                    onUpdateSettings={props.onUpdateSettings}
                />
            )}
        </>
    );
};