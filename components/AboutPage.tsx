import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CarIcon } from './icons/CarIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { UsersIcon } from './icons/UsersIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface AboutPageProps {
    onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
    // Interactive Simulator State
    const [activeTab, setActiveTab] = useState<'customer' | 'shop' | 'admin'>('customer');
    const [customerApproved, setCustomerApproved] = useState(false);
    const [activeBayJob, setActiveBayJob] = useState<'JOB-MOCK001' | 'JOB-MOCK002'>('JOB-MOCK001');
    const [verifiedShops, setVerifiedShops] = useState<Record<string, boolean>>({
        'Apex Paint & Finish': false,
        'Corner Garage Group': true,
        'Metro Collision Center': false
    });

    // Timeline Interactive Step
    const [selectedStep, setSelectedStep] = useState<number>(0);

    const steps = [
        {
            title: "Multimodal Photo Intake",
            icon: PhotoIcon,
            badge: "Phase 1 - Client",
            desc: "The driver uploads damaged panel snapshots. Generative vision model scans geometric distortion and reports depth of scratches versus chassis structural integrity.",
            metric: "Scan duration: < 3.2 seconds",
            color: "from-blue-500 to-indigo-600 shadow-blue-500/20"
        },
        {
            title: "Automated Bodywork Estimate",
            icon: DocumentTextIcon,
            badge: "Phase 2 - Core Engine",
            desc: "Instantly generates detailed parts order logs and labor recommendations. Translates raw estimates into standard tax-itemized invoices directly in the database layers.",
            metric: "Pricing accuracy level: 98.4%",
            color: "from-indigo-500 to-violet-600 shadow-violet-500/20"
        },
        {
            title: "Bespoke Bay Scheduling",
            icon: ClockIcon,
            badge: "Phase 3 - Garage Dispatcher",
            desc: "The smart scheduling engine routes assignments to vacant bodywork or paint preparation bays based on technician specialty and current workloads.",
            metric: "Idle bay backlog drop: -42%",
            color: "from-violet-500 to-purple-600 shadow-purple-500/20"
        },
        {
            title: "Live Lifecycle Telemetry",
            icon: ClipboardDocumentListIcon,
            badge: "Phase 4 - Crew Update",
            desc: "Technicians trigger stage progression directly inside the shop workflow portal. These events notify drivers instantly with secure, end-to-end chat channels.",
            metric: "Inbound phone inquiry drop: -80%",
            color: "from-fuchsia-500 to-pink-600 shadow-fuchsia-500/20"
        }
    ];

    return (
        <div className="bg-slate-950 text-white font-sans min-h-screen relative overflow-hidden selection:bg-indigo-500/30">
            {/* Elegant Background Grid & Ambient Glows */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
            
            {/* Header / Navigation */}
            <header className="sticky top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-6xl">
                    <button onClick={onBack} className="flex items-center gap-2.5 text-white text-xl font-bold group">
                        <CarIcon className="w-8 h-8 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        <span className="font-sans tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">AutoFix AI</span>
                    </button>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm shadow-slate-950/20"
                    >
                        &larr; Back to Home
                    </button>
                </div>
            </header>

            {/* Main Container */}
            <main className="container mx-auto px-6 py-12 lg:py-20 max-w-6xl relative z-10 space-y-24">
                
                {/* Hero section */}
                <section className="text-center space-y-6 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-violet-950/60 to-indigo-950/60 text-violet-300 font-mono text-[10px] uppercase font-extrabold tracking-widest rounded-full border border-violet-800/30"
                    >
                        <SparklesIcon className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                        <span>UNIFY DAMAGE INTAKE & DISPATCH LOBBY</span>
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-indigo-100 bg-clip-text text-transparent"
                    >
                        Restoring Order to Collision Workflows.
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-400 text-sm md:text-base leading-relaxed"
                    >
                        AutoFix AI combines modern cloud databases, local storage, and high-performance design to bridge gaps between vehicle owners, garage crew, estimators, and insurance supervisors.
                    </motion.p>
                </section>

                {/* INTERACTIVE WORKSPACE SIMULATOR */}
                <section className="space-y-8">
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <span className="text-indigo-400 font-mono text-[10px] uppercase tracking-widest font-extrabold block">🕹️ Interactive Preview</span>
                        <h2 className="text-3xl font-bold tracking-tight">The 3-Way Ecosystem Simulator</h2>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Click between the tabs below to simulate real-time operations inside the Customer, Shop Crew, and Platform Admin layers.
                        </p>
                    </div>

                    <div className="bg-slate-900/60 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-sm">
                        {/* Interactive Tab Headers */}
                        <div className="flex border-b border-slate-800 p-2.5 bg-slate-950/60 gap-1 sm:gap-2">
                            <button
                                onClick={() => setActiveTab('customer')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all font-sans text-xs font-bold cursor-pointer ${
                                    activeTab === 'customer'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                }`}
                            >
                                <UsersIcon className="w-4 h-4 shrink-0" />
                                <span className="hidden sm:inline">The Customer Portal</span>
                                <span className="sm:hidden">Customer</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('shop')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all font-sans text-xs font-bold cursor-pointer ${
                                    activeTab === 'shop'
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/10'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                }`}
                            >
                                <WrenchScrewdriverIcon className="w-4 h-4 shrink-0" />
                                <span className="hidden sm:inline">The Shop Portal</span>
                                <span className="sm:hidden">Shop Floor</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all font-sans text-xs font-bold cursor-pointer ${
                                    activeTab === 'admin'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                }`}
                            >
                                <BuildingStorefrontIcon className="w-4 h-4 shrink-0" />
                                <span className="hidden sm:inline">The Admin Console</span>
                                <span className="sm:hidden">Admin</span>
                            </button>
                        </div>

                        {/* Sandbox Viewport */}
                        <div className="p-6 md:p-8 min-h-[340px] flex flex-col justify-between">
                            <AnimatePresence mode="wait">
                                {activeTab === 'customer' && (
                                    <motion.div
                                        key="customer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800/30 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
                                                    Driver Panel Mockup
                                                </span>
                                                <h3 className="text-xl font-bold mt-1 text-slate-100">Toyota Camry Refinish (JOB #001)</h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <ClockIcon className="w-4 h-4 text-slate-500 animate-spin" style={{ animationDuration: '6s' }} />
                                                <span>Live Status:</span>
                                                <span className="px-2 py-0.5 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold">Awaiting Approval</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                            {/* Left Column Bumper */}
                                            <div className="md:col-span-8 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl pt-1">👁️</span>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">AI Damage Assessment</span>
                                                        <p className="text-xs text-slate-350 leading-relaxed">
                                                            Sanding & premium paint layer required on left bumper corner. Computer model reports structural brackets are fully intact.
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="pt-3 border-t border-slate-800/60 flex flex-wrap gap-4 text-xs">
                                                    <div>
                                                        <span className="text-slate-500 block text-[10px] font-mono uppercase">Calculated labor</span>
                                                        <span className="font-semibold text-slate-200">4.5 Hours</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 block text-[10px] font-mono uppercase">Est. Material Cost</span>
                                                        <span className="font-semibold text-slate-200">$185.00</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 block text-[10px] font-mono uppercase">Total Sourced Quote</span>
                                                        <span className="font-semibold text-teal-400">$635.00</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column Simulator Clickable */}
                                            <div className="md:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-extrabold block">Interactive trigger</span>
                                                    <h4 className="text-xs font-bold text-slate-200">Approve the Estimate</h4>
                                                    <p className="text-[10px] text-slate-400">Approve this calculation to notify the workshop foreman instantly.</p>
                                                </div>
                                                
                                                <button
                                                    onClick={() => setCustomerApproved(!customerApproved)}
                                                    className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                                                        customerApproved 
                                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                                                    }`}
                                                >
                                                    {customerApproved ? '✓ Approved & queued for scheduling!' : 'Approve & Submit'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'shop' && (
                                    <motion.div
                                        key="shop"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <span className="px-2.5 py-0.5 bg-violet-950 text-violet-300 border border-violet-800/30 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
                                                    Workshop Crew Mockup
                                                </span>
                                                <h3 className="text-xl font-bold mt-1 text-slate-100">Live Scheduling Board</h3>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Active Bay: <strong className="text-violet-400">Paint Booth Alpha</strong>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Technician cards */}
                                            <div 
                                                onClick={() => setActiveBayJob('JOB-MOCK001')}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                                    activeBayJob === 'JOB-MOCK001' 
                                                        ? 'bg-slate-900 border-violet-500/50 shadow-md shadow-violet-500/5' 
                                                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-violet-600/10 text-violet-300 font-bold flex items-center justify-center text-xs border border-violet-600/20">
                                                        LM
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-100">Linda "Hue" Vance</h4>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Expert Painter</p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs">
                                                    <span className="text-slate-500 text-[10px]">Active job:</span>
                                                    <p className="font-semibold truncate text-slate-300 mt-0.5">Toyota Corolla - Fender Refit</p>
                                                </div>
                                            </div>

                                            <div 
                                                onClick={() => setActiveBayJob('JOB-MOCK002')}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                                    activeBayJob === 'JOB-MOCK002' 
                                                        ? 'bg-slate-900 border-violet-500/50 shadow-md shadow-violet-500/5' 
                                                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-violet-600/10 text-violet-300 font-bold flex items-center justify-center text-xs border border-violet-600/20">
                                                        RM
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-100">Robert "Jack" Mercer</h4>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Bodytech Foreman</p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs">
                                                    <span className="text-slate-500 text-[10px]">Active job:</span>
                                                    <p className="font-semibold truncate text-slate-300 mt-0.5">Tesla Model Y - Aluminum frame pull</p>
                                                </div>
                                            </div>

                                            {/* Quick helper display */}
                                            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between text-xs space-y-2">
                                                <div>
                                                    <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest font-extrabold block">Selected Work Details</span>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                                                        {activeBayJob === 'JOB-MOCK001' 
                                                            ? 'Multi-stage computerized paint match verified (Code 300 - Alpine White). Sinks 5.0 hours next Tuesday.' 
                                                            : 'Structural laser-guided pull coordinates validated on aligning rack. Complete laser validation step is mandatory before clearoff.'}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-mono text-slate-500 bg-slate-900 p-2 rounded-lg border border-slate-800">
                                                    Bay occupancy metric: <span className="text-green-400 font-bold">92.4%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'admin' && (
                                    <motion.div
                                        key="admin"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/30 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
                                                    Supervision Console
                                                </span>
                                                <h3 className="text-xl font-bold mt-1 text-slate-100">Marketplace Governance & Onboarding</h3>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Status: <span className="text-emerald-400 font-semibold">• Active Network</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                            {/* Shops listing */}
                                            <div className="md:col-span-7 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                                                <h4 className="text-xs font-bold tracking-wide uppercase text-slate-400 font-mono">Registered Auto Shop Directory</h4>
                                                
                                                <div className="space-y-2">
                                                    {Object.entries(verifiedShops).map(([shopName, isVerified]) => (
                                                        <div key={shopName} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-base">🏬</span>
                                                                <span className="text-xs font-medium text-slate-200">{shopName}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setVerifiedShops(prev => ({ ...prev, [shopName]: !prev[shopName] }));
                                                                }}
                                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                                                                    isVerified 
                                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold' 
                                                                        : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 font-bold'
                                                                }`}
                                                            >
                                                                {isVerified ? '✓ Approved' : '⏳ Approve Onboarding'}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Metrics Cards */}
                                            <div className="md:col-span-5 grid grid-cols-2 gap-4">
                                                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center flex flex-col justify-between">
                                                    <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider font-semibold">Total Revenue</span>
                                                    <div className="text-2xl font-black text-amber-500 mt-2">$284,510</div>
                                                    <span className="text-[9px] text-emerald-400 font-mono mt-1">+14.2% This Month</span>
                                                </div>
                                                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center flex flex-col justify-between">
                                                    <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider font-semibold">Active Invoices</span>
                                                    <div className="text-2xl font-black text-indigo-400 mt-2">1,240</div>
                                                    <span className="text-[9px] text-indigo-400/70 font-mono mt-1">Pending Sync: 12</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* THE JOURNEY OF A REPAIR TIMELINE */}
                <section className="space-y-12">
                    <div className="text-center space-y-2">
                        <span className="text-violet-400 font-mono text-[10px] uppercase tracking-widest font-extrabold block">✨ Interactive Flow</span>
                        <h2 className="text-3xl font-bold tracking-tight">The Lifecycle Journey of a Repair</h2>
                        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                            Click any lifecycle step below to witness how modern cloud orchestration, local caching, and automated estimating pipelines coordinate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left List of Actions */}
                        <div className="lg:col-span-5 space-y-3">
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                const isSelected = selectedStep === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedStep(idx)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer relative overflow-hidden group ${
                                            isSelected 
                                                ? 'bg-slate-900 border-indigo-500/40 shadow-xl' 
                                                : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                                        }`}
                                    >
                                        <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <span className="text-[9px] font-mono font-medium text-slate-500 block uppercase tracking-wider">
                                                {step.badge}
                                            </span>
                                            <h4 className="text-sm font-bold text-slate-200 mt-0.5 truncate">
                                                {step.title}
                                            </h4>
                                        </div>
                                        <ArrowRightIcon className={`w-4 h-4 shrink-0 transition-transform ${
                                            isSelected ? 'text-indigo-400 translate-x-0' : 'text-slate-600 group-hover:text-slate-400 -translate-x-1 group-hover:translate-x-0'
                                        }`} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Details Panel showcasing detail */}
                        <div className="lg:col-span-7 h-full">
                            <div className="bg-gradient-to-br from-slate-900/80 via-slate-900 to-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden">
                                {/* Accent Gradient Core */}
                                <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${steps[selectedStep].color} opacity-10 rounded-full blur-2xl`} />

                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <span className="text-xs uppercase font-mono text-indigo-400 font-semibold tracking-wider block">
                                                {steps[selectedStep].badge}
                                            </span>
                                            <h3 className="text-2xl font-extrabold text-slate-100">
                                                {steps[selectedStep].title}
                                            </h3>
                                        </div>
                                        <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-300">
                                            {React.createElement(steps[selectedStep].icon, { className: "w-6 h-6" })}
                                        </div>
                                    </div>

                                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                        {steps[selectedStep].desc}
                                    </p>
                                </div>

                                <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Validated metric</span>
                                        <span className="font-mono text-xs text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-900/30 font-semibold inline-block mt-1">
                                            {steps[selectedStep].metric}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                                        <span>SYSTEM VERIFIED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CORE OPERATIONAL ROLE CARD ECOSYSTEMS */}
                <section className="space-y-10">
                    <div className="text-center space-y-2">
                        <span className="text-violet-400 font-mono text-[10px] uppercase tracking-widest font-extrabold block">⚙️ Platform Core</span>
                        <h2 className="text-3xl font-bold tracking-tight">The SaaS Roles & Actors</h2>
                        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                            AutoFix AI matches and directs three primary distinct workflows into a single collaborative workspace.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Card */}
                        <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-6 group hover:border-indigo-500/20 transition-all">
                            <div className="space-y-4">
                                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 w-fit">
                                    <UsersIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                    The Driver
                                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40">CUSTOMER</span>
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Needs transparent progress tracking and immediate chat feedback without placing multiple repetitive status check phone calls to the body shop.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 space-y-1.5">
                                <span className="font-bold uppercase font-mono tracking-wider text-[9px] text-slate-400 block">Actions</span>
                                <p>• Scans and submits damages easily.</p>
                                <p>• Approves or declines paint quotes.</p>
                                <p>• In-app text chat with workshop mechanics.</p>
                            </div>
                        </div>

                        {/* Crew Card */}
                        <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-6 group hover:border-violet-500/20 transition-all">
                            <div className="space-y-4">
                                <div className="p-3 bg-violet-500/10 text-violet-400 rounded-2xl border border-violet-500/20 w-fit">
                                    <WrenchScrewdriverIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                    The Crew
                                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800/40">SHOP PORTAL</span>
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Demands layout dispatch tools that keep paint booths operating at maximum utilization and prevent body tech backlogs.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 space-y-1.5">
                                <span className="font-bold uppercase font-mono tracking-wider text-[9px] text-slate-400 block">Actions</span>
                                <p>• Calendar slot assignments for specialists.</p>
                                <p>• Drag-and-drop workflow status updates.</p>
                                <p>• Material stock depletion tracking.</p>
                            </div>
                        </div>

                        {/* Admin Card */}
                        <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-6 group hover:border-emerald-500/20 transition-all">
                            <div className="space-y-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 w-fit">
                                    <BuildingStorefrontIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                    The Operator
                                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">ADMIN</span>
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Oversees platform trust, coordinates incoming support queries, verifies newly registered body shops, and validates transactional billing fees.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 space-y-1.5">
                                <span className="font-bold uppercase font-mono tracking-wider text-[9px] text-slate-400 block">Actions</span>
                                <p>• Approving newly registered garages on map.</p>
                                <p>• Resolves client disputed service tickets.</p>
                                <p>• Auditing platform commission revenues.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TECHNOLOGY STACK GRID */}
                <section className="space-y-12">
                    <div className="text-center space-y-2">
                        <span className="text-indigo-400 font-mono text-[10px] uppercase tracking-widest font-extrabold block">🛠️ Platform Stack</span>
                        <h2 className="text-3xl font-bold tracking-tight">Our Modern Design Pairings</h2>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                            Engineered on top of lightning-fast frameworks for absolute visual and state fluidity.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 text-center space-y-2 hover:bg-slate-900 hover:border-slate-700/50 transition-all">
                            <span className="text-2xl">⚡</span>
                            <h4 className="text-xs font-bold text-slate-200">TypeScript SPA</h4>
                            <p className="text-[10px] text-slate-500 font-mono">Static React 19 Engine</p>
                        </div>
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 text-center space-y-2 hover:bg-slate-900 hover:border-slate-700/50 transition-all">
                            <span className="text-2xl">🎨</span>
                            <h4 className="text-xs font-bold text-slate-200">Tailwind CSS</h4>
                            <p className="text-[10px] text-slate-500 font-mono">Modern Swiss Aesthetics</p>
                        </div>
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 text-center space-y-2 hover:bg-slate-900 hover:border-slate-700/50 transition-all">
                            <span className="text-2xl">🔮</span>
                            <h4 className="text-xs font-bold text-slate-200">Motion React</h4>
                            <p className="text-[10px] text-slate-500 font-mono">Fluid State Animations</p>
                        </div>
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 text-center space-y-2 hover:bg-slate-900 hover:border-slate-700/50 transition-all">
                            <span className="text-2xl">📦</span>
                            <h4 className="text-xs font-bold text-slate-200">Local Cache</h4>
                            <p className="text-[10px] text-slate-500 font-mono">Zero-Latency State Persistence</p>
                        </div>
                    </div>
                </section>

                {/* Final Call To Action */}
                <section className="text-center bg-gradient-to-r from-slate-900/80 to-indigo-950/30 p-8 rounded-3xl border border-slate-800/80 max-w-2xl mx-auto space-y-5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 font-mono text-[8px] uppercase tracking-wider text-indigo-400/40 font-bold bg-indigo-500/5 select-none">
                        Active Session
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-100">Ready to explore the main workspace?</h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                        Head back to the dashboard to test intake estimates, dispatch timelines, and client chat boards.
                    </p>
                    <button
                        onClick={onBack}
                        className="bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg shadow-indigo-600/15"
                    >
                        <span>Launch AutoFix Dashboard</span>
                        <ArrowRightIcon className="w-4 h-4 text-white" />
                    </button>
                </section>

            </main>

            {/* Premium Subdued Footer */}
            <footer className="border-t border-slate-900 py-10 text-center text-slate-500 text-xs mt-20">
                <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">&copy; {new Date().getFullYear()} AutoFix AI System Platform.</p>
                <p className="text-[10px] text-slate-700 mt-1">Refined Swiss display architecture & absolute state persistence.</p>
            </footer>
        </div>
    );
};
