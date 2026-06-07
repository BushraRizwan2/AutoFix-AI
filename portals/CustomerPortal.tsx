
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BookingsPage } from '../components/BookingsPage';
import { ProfilePage } from '../components/ProfilePage';
import { JobDetailsPage } from './customer/JobDetailsPage';
import { User, Job, Shop, CustomerPage, AIAnalysisResult, SupportTicket, AppSettings } from '../types';
import { Layout } from '../components/Layout';
import { customerNavItems } from '../navConfig';
import { SupportChatPage } from './customer/SupportChatPage';
import { NewEstimatePage } from './customer/NewEstimatePage';
import { PrintableInvoice } from '../components/PrintableInvoice';
import { PaymentModal } from '../components/PaymentModal';
import { SettingsModal } from '../components/SettingsModal';
import { useNotifications } from '../contexts/NotificationContext';
import { NotificationsPage } from './customer/NotificationsPage';


interface CustomerPortalProps {
    user: User;
    onLogout: () => void;
    jobs: Job[];
    shops: Shop[];
    onNewJob: (jobDetails: Omit<Job, 'id' | 'lastUpdate' | 'chatHistory'>) => Job;
    onNewAIQuote: (jobDetails: Omit<Job, 'id' | 'status' | 'lastUpdate' | 'chatHistory' | 'aiAnalysis'>, aiAnalysis: AIAnalysisResult) => Job;
    onSendChatMessage: (jobId: string, messageText: string) => void;
    onPayment: (jobId: string) => void;
    onReview: (jobId: string, rating: number, reviewText: string) => void;
    supportTickets: SupportTicket[];
    onSendSupportMessage: (ticketId: string, messageText: string, sender: 'customer' | 'admin') => void;
    onAcceptQuote: (jobId: string, bookingDate: string) => void;
    onDeclineQuote: (jobId: string) => void;
    settings: AppSettings;
    onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}


export const CustomerPortal: React.FC<CustomerPortalProps> = (props) => {
  const [page, setPage] = useState<CustomerPage>('bookings');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [paymentJob, setPaymentJob] = useState<Job | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  const handleNavigate = (targetPage: CustomerPage) => {
    setPage(targetPage);
    setSelectedJobId(null);
    setSelectedTicket(null);
  };
  
  const handleSuccess = (newJob: Job) => {
    setSelectedJobId(newJob.id);
    setPage('job_details');
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setPage('job_details');
  };
  
  const handleSelectTicket = (ticket: SupportTicket) => {
      setSelectedTicket(ticket);
  };

  const handleBackToBookings = () => {
    setSelectedJobId(null);
    setPage('bookings');
  };

  const handleConfirmPayment = (jobId: string) => {
    const job = props.jobs.find(j => j.id === jobId);
    props.onPayment(jobId);
    setPaymentJob(null);
    if(job) {
        addNotification({
            type: 'feedback',
            message: `Service for your ${job.carDetails.make} ${job.carDetails.model} is complete! Please leave a review.`,
            jobId: jobId
        });
    }
  };
  
   const handlePrintInvoice = (job: Job) => {
        const newWindow = window.open('', '', 'height=800,width=800');
        if (newWindow) {
            newWindow.document.write('<html><head><title>Print Invoice</title></head><body><div id="print-root"></div></body></html>');
            
            const printRoot = newWindow.document.getElementById('print-root');
            if(printRoot) {
                const root = ReactDOM.createRoot(printRoot);
                root.render(<PrintableInvoice job={job} />);
                // Need a slight delay for content to render before printing
                setTimeout(() => {
                    newWindow.print();
                    newWindow.close();
                }, 500);
            }
        }
    };


  const renderContent = () => {
    if (page === 'job_details' && selectedJobId) {
       const selectedJob = props.jobs.find(j => j.id === selectedJobId);
       if(selectedJob) {
          return (
            <JobDetailsPage 
                job={selectedJob} 
                onBack={handleBackToBookings}
                onSendMessage={(msg) => props.onSendChatMessage(selectedJob.id, msg)}
                onPayment={() => setPaymentJob(selectedJob)}
                onReview={(rating, review) => props.onReview(selectedJob.id, rating, review)}
                onAcceptQuote={props.onAcceptQuote}
                onDeclineQuote={props.onDeclineQuote}
                onPrintInvoice={handlePrintInvoice}
            />
          );
       }
    }
    
    switch (page) {
      case 'new_estimate':
        return <NewEstimatePage 
                  shops={props.shops.filter(s => s.status === 'Approved')} 
                  user={props.user}
                  onNewJob={props.onNewJob}
                  onNewAIQuote={props.onNewAIQuote}
                  onSuccess={handleSuccess}
                />
      case 'bookings':
        return <BookingsPage jobs={props.jobs} onSelectJob={handleSelectJob} onNewQuote={() => handleNavigate('new_estimate')} />;
      case 'profile':
        return <ProfilePage user={props.user} jobs={props.jobs} onLogout={props.onLogout} onViewInvoice={(job) => { setSelectedJobId(job.id); setPage('job_details'); }} onOpenSettings={() => setIsSettingsModalOpen(true)} />;
       case 'support_chat':
        return <SupportChatPage 
                tickets={props.supportTickets} 
                selectedTicket={selectedTicket}
                onSelectTicket={handleSelectTicket}
                onSendMessage={(msg) => selectedTicket && props.onSendSupportMessage(selectedTicket.id, msg, 'customer')}
                onBack={() => setSelectedTicket(null)}
                />;
      case 'notifications':
         return <NotificationsPage onSelectJob={handleSelectJob} />;
      default:
        return <BookingsPage jobs={props.jobs} onSelectJob={handleSelectJob} onNewQuote={() => handleNavigate('new_estimate')} />;
    }
  };
  
  const activePageForNav = page === 'job_details' ? 'bookings' : page;

  return (
    <>
        <Layout
            user={props.user}
            onLogout={props.onLogout}
            navItems={customerNavItems}
            activePage={activePageForNav}
            onNavigate={handleNavigate}
            title="Customer Portal"
            onOpenSettings={() => setIsSettingsModalOpen(true)}
        >
            {renderContent()}
        </Layout>
        {paymentJob && (
            <PaymentModal
                job={paymentJob}
                onClose={() => setPaymentJob(null)}
                onConfirmPayment={handleConfirmPayment}
            />
        )}
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