
import React, { useState } from 'react';
import { Job } from '../../types';
import { JobStatusTracker } from '../../components/JobStatusTracker';
import { ChatInterface } from '../../components/ChatInterface';
import { InvoiceView } from '../../components/InvoiceView';
import { StarRating } from '../../components/StarRating';
import { CarIcon } from '../../components/icons/CarIcon';
import { BuildingStorefrontIcon } from '../../components/icons/BuildingStorefrontIcon';
import { CreditCardIcon } from '../../components/icons/CreditCardIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import { CalendarDaysIcon } from '../../components/icons/CalendarDaysIcon';
import { PhotoIcon } from '../../components/icons/PhotoIcon';
import { XCircleIcon } from '../../components/icons/XCircleIcon';

interface JobDetailsPageProps {
    job: Job;
    onBack: () => void;
    onSendMessage: (message: string) => void;
    onPayment: () => void;
    onReview: (rating: number, review: string) => void;
    onAcceptQuote: (jobId: string, bookingDate: string) => void;
    onDeclineQuote: (jobId: string) => void;
    onPrintInvoice: (job: Job) => void;
}

const InfoCard: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({title, icon, children}) => (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-5 card-interactive">
        <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{icon}</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {children}
        </div>
    </div>
);

const PhotoGrid: React.FC<{title: string, photos: string[]}> = ({ title, photos }) => {
    if (photos.length === 0) return null;
    return (
        <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h4>
            <div className="grid grid-cols-2 gap-2">
                {photos.map((src, index) => (
                    <a key={index} href={src} target="_blank" rel="noopener noreferrer">
                        <img src={src} alt={`photo ${index+1}`} className="w-full h-24 object-cover rounded-md transition-transform hover:scale-105" />
                    </a>
                ))}
            </div>
        </div>
    )
}

const QuoteView: React.FC<{
    job: Job;
    onAccept: (jobId: string, bookingDate: string) => void;
    onDecline: (jobId: string) => void;
}> = ({ job, onAccept, onDecline }) => {
    const [bookingDate, setBookingDate] = useState('');
    const [showBooking, setShowBooking] = useState(false);
    const { quote } = job;
    if (!quote) return null;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const handleAccept = () => {
        if (bookingDate) {
            onAccept(job.id, bookingDate);
        } else {
            alert('Please select a booking date.');
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 card-interactive">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Quote from {job.shop.name}</h3>
            
            <div className="mb-4">
                 {quote.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                        <p>{item.description} (x{item.quantity})</p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                 ))}
            </div>
             <div className="text-right font-bold text-lg my-4 text-slate-900 dark:text-white">
                Total: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">{formatCurrency(quote.total)}</span>
            </div>
            {quote.notes && <p className="text-sm italic text-slate-500 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">Notes from shop: "{quote.notes}"</p>}
            
            {!showBooking ? (
                <div className="mt-6 flex gap-3 justify-end items-center">
                    <button 
                        onClick={() => onDecline(job.id)} 
                        className="flex items-center justify-center gap-2 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 font-semibold p-2.5 sm:px-6 sm:py-2.5 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                        title="Decline Quote"
                    >
                        <XCircleIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Decline Quote</span>
                    </button>
                    <button 
                        onClick={() => setShowBooking(true)} 
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-2.5 sm:px-6 sm:py-2.5 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg font-medium"
                        title="Accept & Book"
                    >
                        <CheckCircleIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Accept & Book</span>
                    </button>
                </div>
            ) : (
                 <div className="mt-6 p-4 bg-violet-100 dark:bg-violet-900/20 rounded-lg border border-violet-300 dark:border-violet-500/30">
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                       Choose a date for your vehicle drop-off
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                         <div className="relative flex-grow">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <CalendarDaysIcon className="h-5 w-5 text-slate-400 dark:text-slate-400"/>
                            </div>
                             <input
                                type="date" id="bookingDate" value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-10 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition text-slate-900 dark:text-white"
                            />
                        </div>
                        <button 
                            onClick={handleAccept} 
                            disabled={!bookingDate} 
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold p-3 sm:px-6 sm:py-3 rounded-lg hover:from-emerald-500 hover:to-green-500 disabled:from-slate-400 disabled:to-slate-600 transition-all"
                            title="Confirm Booking"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Confirm Booking</span>
                        </button>
                    </div>
                 </div>
            )}
        </div>
    );
}

export const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ job, onBack, onSendMessage, onPayment, onReview, onAcceptQuote, onDeclineQuote, onPrintInvoice }) => {
    
    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <button onClick={onBack} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors mb-2">
                        &larr; Back to all bookings
                    </button>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Job Details</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Job ID: {job.id}</p>
                </div>
            </div>

            {job.status !== 'New' && job.status !== 'Quote Provided' && job.status !== 'Estimate' && job.status !== 'Cancelled' && (
                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/50 mb-8 card-interactive">
                    <JobStatusTracker currentStatus={job.status} />
                </div>
            )}


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {job.status === 'Quote Provided' && (
                        <QuoteView job={job} onAccept={onAcceptQuote} onDecline={onDeclineQuote} />
                    )}
                    {job.status === 'New' && (
                         <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg text-center border border-cyan-200 dark:border-cyan-500/20">
                            <h3 className="text-lg font-semibold text-cyan-800 dark:text-cyan-300">Quote in Review</h3>
                            <p className="text-sm text-cyan-700 dark:text-cyan-400/80 mt-1">
                                {job.shop.name} is reviewing your request. You'll be notified when your quote is ready.
                            </p>
                        </div>
                    )}
                    {job.status === 'Awaiting Payment' && job.invoice && (
                        <div className="bg-violet-100 dark:bg-violet-900/20 border-l-4 border-violet-500 p-6 rounded-r-lg">
                             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <CreditCardIcon className="h-8 w-8 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-violet-800 dark:text-violet-300">Payment Required</h3>
                                    <p className="text-sm text-violet-700 dark:text-violet-400/80 mt-1">
                                        Your vehicle is ready. Please complete the payment of <strong className="text-slate-900 dark:text-white">{job.invoice.total.toFixed(2)}</strong> to finalize the service.
                                    </p>
                                </div>
                                <button 
                                    onClick={onPayment} 
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-2.5 sm:px-6 sm:py-2.5 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg flex-shrink-0"
                                    title="Pay Now"
                                >
                                    <CreditCardIcon className="h-5 w-5" />
                                    <span className="hidden sm:inline">Pay Now</span>
                                </button>
                            </div>
                        </div>
                    )}
                     {job.status === 'Completed' && (
                        <div className="bg-emerald-100 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-6 rounded-r-lg flex items-center gap-4">
                             <CheckCircleIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                             <div>
                                <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">Service Completed</h3>
                                <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mt-1">Thank you for choosing us! We'd love to hear your feedback.</p>
                             </div>
                        </div>
                    )}

                    {job.invoice && <InvoiceView job={job} onPrint={onPrintInvoice} />}
                    {job.status === 'Completed' && <StarRating onSubmit={onReview} isSubmitted={!!job.rating} />}
                    <ChatInterface messages={job.chatHistory} onSendMessage={onSendMessage} currentUserSender="customer" />
                </div>
                <div className="space-y-6">
                    <InfoCard title="Shop Details" icon={<BuildingStorefrontIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />}>
                        <p><strong>Name:</strong> <span className="text-slate-800 dark:text-slate-200">{job.shop.name}</span></p>
                        <p><strong>Address:</strong> <span className="text-slate-800 dark:text-slate-200">{job.shop.address}</span></p>
                    </InfoCard>
                     <InfoCard title="Vehicle Details" icon={<CarIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />}>
                        <p><strong>Make:</strong> <span className="text-slate-800 dark:text-slate-200">{job.carDetails.make}</span></p>
                        <p><strong>Model:</strong> <span className="text-slate-800 dark:text-slate-200">{job.carDetails.model}</span></p>
                        <p><strong>Year:</strong> <span className="text-slate-800 dark:text-slate-200">{job.carDetails.year}</span></p>
                        <p><strong>Reg. No:</strong> <span className="text-slate-800 dark:text-slate-200">{job.carDetails.registrationNo}</span></p>
                    </InfoCard>
                     <InfoCard title="Photos" icon={<PhotoIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />}>
                        <div className="space-y-3">
                           <PhotoGrid title="Damage" photos={job.photos.damage} />
                           <PhotoGrid title="In-Progress" photos={job.photos.inProgress} />
                           <PhotoGrid title="Completed" photos={job.photos.completed} />
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};
