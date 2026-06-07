
import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { Spinner } from './Spinner';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';

interface PaymentModalProps {
  job: Job;
  onClose: () => void;
  onConfirmPayment: (jobId: string) => void;
}

const formatCurrency = (amount?: number) => {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const PaymentButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({onClick, children}) => (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-3 p-3 bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-slate-800 dark:text-slate-200">
        {children}
    </button>
)

export const PaymentModal: React.FC<PaymentModalProps> = ({ job, onClose, onConfirmPayment }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
          onConfirmPayment(job.id);
      }, 1500);
    }, 2000);
  };

  const renderContent = () => {
    if (isProcessing) {
      return (
        <div className="text-center py-12">
            <Spinner className="h-12 w-12 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4">Processing Payment...</h3>
        </div>
      );
    }

    if (isSuccess) {
      return (
         <div className="text-center py-12">
            <CheckCircleIcon className="h-16 w-16 mx-auto text-emerald-500 dark:text-emerald-400" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4">Payment Successful!</h3>
            <p className="text-slate-600 dark:text-slate-400">Thank you for your business.</p>
        </div>
      );
    }
    
    return (
        <>
            <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 border-2 border-emerald-200 dark:border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCardIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 id="payment-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">Complete Your Payment</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">You are paying <span className="font-bold text-slate-800 dark:text-white">{job.shop.name}</span></p>
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 my-4">
                    {formatCurrency(job.invoice?.total)}
                </p>
            </div>
            <div className="space-y-3 mt-6">
                <PaymentButton onClick={handlePayment}>
                    <CreditCardIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                    <span className="font-semibold">Pay with Card</span>
                </PaymentButton>
                 <PaymentButton onClick={handlePayment}>
                     <img src="https://www.svgrepo.com/show/303153/paypal-logo.svg" className="w-6 h-6" alt="PayPal icon" />
                    <span className="font-semibold">Pay with PayPal</span>
                </PaymentButton>
                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-700/50"></div>
                    <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs">OR</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-700/50"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <PaymentButton onClick={handlePayment}>
                         <GoogleIcon className="w-6 h-6"/>
                         <span className="font-semibold">Pay</span>
                    </PaymentButton>
                    <PaymentButton onClick={handlePayment}>
                         <AppleIcon className="w-6 h-6 text-slate-800 dark:text-white"/>
                         <span className="font-semibold">Pay</span>
                    </PaymentButton>
                </div>
            </div>
        </>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-sm m-4 p-8 border border-slate-200 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {!isProcessing && !isSuccess && (
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <XMarkIcon className="h-6 w-6" />
            </button>
        )}
        {renderContent()}
      </div>
    </div>
  );
};