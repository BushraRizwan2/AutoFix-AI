
import React from 'react';
import { JobStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface JobStatusTrackerProps {
  currentStatus: JobStatus;
}

interface StatusStep {
  status: JobStatus;
  label: string;
  shortDesc: string;
  longDesc: string;
  icon: React.ComponentType<any>;
}

const steps: StatusStep[] = [
  {
    status: 'Booking Confirmed',
    label: 'Confirmed',
    shortDesc: 'Drop-off & check-in',
    longDesc: 'Your shop appointment is secured. We are ready to receive your vehicle and begin pre-repair inspection.',
    icon: CalendarDaysIcon
  },
  {
    status: 'In Repair',
    label: 'In Repair',
    shortDesc: 'Structural bodywork',
    longDesc: 'Technicians are actively repairing damage, shaping sheet metals, replacing panels, or pulling frame alignments.',
    icon: WrenchScrewdriverIcon
  },
  {
    status: 'Painting',
    label: 'Painting',
    shortDesc: 'Surface refinishing',
    longDesc: 'Entering the paint booth! We match custom paint codes, lay primer, color-coat layers, and finish with a glassy glossy clear-coat.',
    icon: SparklesIcon
  },
  {
    status: 'Final Check',
    label: 'Inspecting',
    shortDesc: 'Detailing & checking',
    longDesc: 'Reassembling hardwares, executing detail washes, and performing a meticulous 50-point safety and surface quality check.',
    icon: ClipboardDocumentListIcon
  },
  {
    status: 'Awaiting Payment',
    label: 'Ready',
    shortDesc: 'Payment pending',
    longDesc: 'All restoration is completed and certified! Please review the electronic invoice and complete payment to unlock your vehicle.',
    icon: BanknotesIcon
  },
  {
    status: 'Completed',
    label: 'Completed',
    shortDesc: 'Keys handed over',
    longDesc: 'Payment processed and service completed. Your car is pristine and ready! Drive safe and thank you for choosing AutoFix AI.',
    icon: CheckCircleIcon
  }
];

export const JobStatusTracker: React.FC<JobStatusTrackerProps> = ({ currentStatus }) => {
  // If current status is Cancelled, New, Estimate etc., let's find closest active state or show a fallback banner
  const activeIndex = steps.findIndex(step => step.status === currentStatus);
  const currentStepIndex = activeIndex !== -1 ? activeIndex : 0;
  const activeStep = steps[currentStepIndex];

  // Helper colors based on status matching
  const getProgressColor = (idx: number) => {
    if (idx < currentStepIndex) return 'from-violet-600 via-indigo-600 to-emerald-500'; // Past steps
    if (idx === currentStepIndex) return 'from-indigo-600 to-indigo-500'; // Active step
    return 'from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-700'; // Future steps
  };

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            Repair Progress Timeline
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Real-time shop workspace updates and visual diagnostics.
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-mono font-bold border border-slate-200 dark:border-slate-700">
          Phase {currentStepIndex + 1} of {steps.length}
        </div>
      </div>

      {/* 1. HORIZONTAL TRACKER (DESKTOP / MD screens) */}
      <div className="hidden md:block relative px-4 text-center select-none">
        <div className="flex items-center justify-between relative">
          
          {/* Timeline background connectors */}
          <div className="absolute left-[5%] right-[5%] top-6 h-1 bg-slate-100 dark:bg-slate-800 rounded-full z-0 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>

          {/* Step Circular Nodes */}
          {steps.map((step, index) => {
            const isCompleted = currentStepIndex > index;
            const isActive = currentStepIndex === index;
            const isFuture = currentStepIndex < index;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex flex-col items-center relative z-10 w-24">
                {/* Visual Circle Indicator */}
                <div className="relative">
                  {/* Pulsing active aura effect */}
                  {isActive && (
                    <motion.div 
                      className="absolute -inset-2 bg-indigo-500/25 dark:bg-indigo-400/25 rounded-full"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center h-12 w-12 rounded-full border-2 cursor-pointer transition-all ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-violet-600 to-emerald-500 border-transparent text-white shadow-md' 
                        : isActive
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 border-indigo-400 text-white shadow-lg ring-4 ring-indigo-500/10'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  {/* Fully finished green tag icon overlay */}
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Captions */}
                <p className={`mt-3 text-xs font-semibold tracking-tight transition-all truncate w-24 ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : isCompleted ? 'text-slate-800 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {step.label}
                </p>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 truncate w-24 mt-0.5 block">
                  {step.shortDesc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. VERTICAL TRACKER (MOBILE / SM screens) */}
      <div className="block md:hidden space-y-6">
        <div className="relative pl-2">
          {/* Vertical progress background line */}
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-slate-100 dark:bg-slate-800 rounded-full z-0 overflow-hidden">
            <motion.div 
              className="w-full bg-gradient-to-b from-violet-600 via-indigo-600 to-emerald-500"
              initial={{ height: '0%' }}
              animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ originY: 0 }}
            />
          </div>

          <div className="space-y-5">
            {steps.map((step, index) => {
              const isCompleted = currentStepIndex > index;
              const isActive = currentStepIndex === index;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex gap-4 items-start relative z-10">
                  <div className="relative shrink-0">
                    {/* Pulsing glow aura behind active circle on mobile */}
                    {isActive && (
                      <motion.div 
                        className="absolute -inset-1.5 bg-indigo-500/25 dark:bg-indigo-400/25 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <div className={`flex items-center justify-center h-9 w-9 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-violet-600 to-emerald-500 border-transparent text-white' 
                        : isActive
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 border-indigo-400 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="flex-grow pt-0.5">
                    <h4 className={`text-sm font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-450 dark:text-slate-500'}`}>
                      {step.label} {isActive && <span className="ml-1 text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-mono border border-indigo-200 dark:border-indigo-900/30">Active</span>}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">
                      {step.shortDesc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. SWAPPING EXPLAINER PANEL WITH TRANSITIONS */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-8 p-5 bg-gradient-to-br from-indigo-50/40 to-slate-50/50 dark:from-indigo-950/10 dark:to-slate-900/20 rounded-2xl border border-indigo-100/60 dark:border-indigo-950/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="p-3 bg-white dark:bg-slate-850 rounded-xl shadow-sm border border-indigo-100/80 dark:border-slate-800 flex-shrink-0">
            {React.createElement(activeStep.icon, { className: "h-6 w-6 text-indigo-600 dark:text-indigo-400" })}
          </div>
          <div>
            <span className="text-[10px] font-mono font-extrabold uppercase text-indigo-500 dark:text-indigo-400 tracking-wider">
              Current Repair Status: {activeStep.label}
            </span>
            <h4 className="text-slate-800 dark:text-slate-200 font-bold text-sm mt-0.5">
              {activeStep.shortDesc}
            </h4>
            <p className="text-slate-600 dark:text-slate-450 text-[11px] sm:text-xs leading-relaxed mt-1">
              {activeStep.longDesc}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

