import React, { useState, useEffect, useCallback } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { CarIcon } from './icons/CarIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

const DemoLoginButton: React.FC<{
  onClick: () => void;
  role: string;
  email: string;
  icon: React.FC<any>;
}> = ({ onClick, role, email, icon: Icon }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center text-left gap-3 p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
    >
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
        <div className="flex-grow">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Login as {role}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
        </div>
        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">&rarr;</span>
    </button>
);

const SocialLoginButton: React.FC<{
  provider: 'Google' | 'Apple';
  onClick: () => void;
  icon: React.FC<any>;
}> = ({ provider, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        type="button"
        className="w-full flex items-center justify-center gap-3 p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
    >
        <Icon className={`h-6 w-6 ${provider === 'Apple' ? 'text-slate-800 dark:text-white' : ''}`} />
        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Continue with {provider}</span>
    </button>
);


export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
        setStep('email');
        setEmail('');
        setOtp('');
        setError('');
        setIsLoading(false);
    }, 300); // Reset after transition
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      console.log(`--- OTP SIMULATION: An OTP has been "sent" to ${email}. DEMO OTP: 123456 ---`);
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Allow any password for demo purposes if it's one of the test accounts
    const isTestAccount = ['customer@example.com', 'shop@example.com', 'admin@example.com'].includes(email);
    if (otp === '123456' || isTestAccount) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin(email);
        handleClose();
      }, 500);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };
  
  const AuthButton: React.FC<{ type?: "button" | "submit" | "reset", disabled?: boolean, children: React.ReactNode }> = ({ type = "submit", disabled, children }) => (
     <button type={type} disabled={disabled} className="mt-4 w-full flex items-center justify-center gap-3 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg px-8 py-3 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105">
        {children}
    </button>
  );

  const renderEmailStep = () => (
    <>
        <form onSubmit={handleSendOtp}>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 p-3 bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    required
                    autoFocus
                />
            </div>
            <AuthButton disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
            </AuthButton>
        </form>

        <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400 text-sm">Or for customers</span>
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SocialLoginButton provider="Google" onClick={() => onLogin('customer@example.com')} icon={GoogleIcon} />
            <SocialLoginButton provider="Apple" onClick={() => onLogin('customer@example.com')} icon={AppleIcon} />
        </div>

        <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400 text-sm">Or login with a demo account</span>
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        </div>

        <div className="space-y-3">
             <DemoLoginButton 
                onClick={() => onLogin('customer@example.com')}
                role="Customer"
                email="customer@example.com"
                icon={UserCircleIcon}
            />
            <DemoLoginButton 
                onClick={() => onLogin('shop@example.com')}
                role="Shop Owner"
                email="shop@example.com"
                icon={BuildingStorefrontIcon}
            />
            <DemoLoginButton 
                onClick={() => onLogin('admin@example.com')}
                role="Administrator"
                email="admin@example.com"
                icon={Cog6ToothIcon}
            />
        </div>
    </>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp}>
        <div className="mb-5 p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 dark:from-amber-400/10 dark:to-transparent rounded-xl border border-amber-500/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 font-mono text-[8px] uppercase tracking-wider text-amber-500/40 font-bold bg-amber-500/5 select-none">
                Sandbox Mode
            </div>
            
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                We have generated a simulated verification code for <strong className="text-amber-900 dark:text-amber-200 font-bold break-all">{email}</strong>.
            </p>
            
            <div className="mt-3 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Your Verification OTP:
                </span>
                <span className="px-4 py-1.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-amber-300 font-mono text-lg font-extrabold tracking-widest rounded-lg shadow-sm border border-amber-500/30">
                    123456
                </span>
                
                <button
                    type="button"
                    onClick={() => {
                        setOtp('123456');
                        setError('');
                    }}
                    className="mt-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 underline cursor-pointer transition-colors"
                >
                    ⚡ Auto-fill 123456 &rarr;
                </button>
            </div>
        </div>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <LockClosedIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full pl-12 p-3 bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition tracking-widest text-center placeholder:text-slate-400 dark:placeholder:text-slate-500"
                required
                autoFocus
            />
        </div>
        <AuthButton disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify & Login'}
        </AuthButton>
        <button type="button" onClick={() => setStep('email')} className="mt-2 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors hover:underline text-center w-full">
            Change email
        </button>
    </form>
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 border border-slate-200 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/50 border-2 border-violet-200 dark:border-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CarIcon className="h-8 w-8 text-violet-500 dark:text-violet-400" />
            </div>
            <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
                {step === 'email' ? 'Login or Sign Up' : 'Enter Verification Code'}
            </h2>
        </div>
        
        {step === 'email' ? renderEmailStep() : renderOtpStep()}
        
        {error && (
            <p className="mt-4 text-sm text-center text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};