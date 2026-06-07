
import React, { useState } from 'react';
import { User, Job, Shop, ShopPage, ClientDetails, StaffMember, Part, ManualQuote, ShopService, AppSettings } from '../types';
import { ShopDashboard } from './shop/ShopDashboard';
import { ShopJobDetails } from './shop/ShopJobDetails';
import { Layout } from '../components/Layout';
import { shopNavItems } from '../navConfig';
import { ProfilePage } from '../components/ProfilePage';
import { ManagementTable } from './admin/ManagementTable';
import { WorkflowPage } from './shop/WorkflowPage';
import { StaffRecordManagementPage } from './shop/StaffRecordManagementPage';
import { ServicesManagementPage } from './shop/ServicesManagementPage';
import { EarningsPage } from './shop/EarningsPage';
import { SettingsModal } from '../components/SettingsModal';

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
    settings: AppSettings;
    onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const ShopPortal: React.FC<ShopPortalProps> = (props) => {
    const [activePage, setActivePage] = useState<ShopPage>('dashboard'); 
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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
                 const jobData = props.jobs.map(j => ({
                     ...j,
                     carDetails: `${j.carDetails.year} ${j.carDetails.make} ${j.carDetails.model}`
                 }));
                 return <ManagementTable 
                            title="All Jobs"
                            description="View and manage all jobs assigned to your shop."
                            columns={jobColumns}
                            data={jobData}
                            onManageClick={(item) => handleSelectJob(item as Job)}
                        />;
            }
             case 'staff':
                return <StaffRecordManagementPage staff={props.shop.staff} onUpdateStaff={handleUpdateShopStaff} />;
            case 'services':
                return <ServicesManagementPage services={props.shop.services} onUpdateServices={handleUpdateShopServices} />;
             case 'parts':
                return <div className="p-8 text-center"><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Parts Management</h1><p className="mt-4 text-slate-500 dark:text-slate-400">A global parts inventory and supplier management system will be here.</p></div>;
            case 'earnings':
                return <EarningsPage jobs={props.jobs} />;
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
