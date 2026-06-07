import React, { useState, useMemo } from 'react';
import { Job, Shop, StaffMember, JobStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDaysIcon } from '../../components/icons/CalendarDaysIcon';
import { WrenchScrewdriverIcon } from '../../components/icons/WrenchScrewdriverIcon';
import { UserCircleIcon } from '../../components/icons/UserCircleIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import { ClockIcon } from '../../components/icons/ClockIcon';
import { XMarkIcon } from '../../components/icons/XMarkIcon';
import { PlusCircleIcon } from '../../components/icons/PlusCircleIcon';
import { ShieldCheckIcon } from '../../components/icons/ShieldCheckIcon';
import { ArrowRightIcon } from '../../components/icons/ArrowRightIcon';

interface CalendarPageProps {
    jobs: Job[];
    shop: Shop;
    onSelectJob: (job: Job) => void;
    onUpdateBookingDate: (jobId: string, date: string) => void;
    onUpdateStaff: (jobId: string, staff: StaffMember[]) => void;
    onUpdateStatus: (jobId: string, status: Job['status']) => void;
}

type ViewType = 'month' | 'week' | 'technician';

export const CalendarPage: React.FC<CalendarPageProps> = ({
    jobs,
    shop,
    onSelectJob,
    onUpdateBookingDate,
    onUpdateStaff,
    onUpdateStatus
}) => {
    // Determine a smart initial month based on available scheduled jobs
    const initialDate = useMemo(() => {
        const jobsWithBooking = jobs.filter(j => j.bookingDate);
        if (jobsWithBooking.length > 0) {
            // Find the most recent job booking or default to the most popular month
            // Sort by bookingDate descending
            const sorted = [...jobsWithBooking].sort((a, b) => b.bookingDate!.localeCompare(a.bookingDate!));
            return new Date(sorted[0].bookingDate! + 'T00:00:00');
        }
        return new Date(); // Local year/month
    }, [jobs]);

    const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth()); // 0-indexed
    const [viewType, setViewType] = useState<ViewType>('month');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTechId, setSelectedTechId] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Detail Panel/Modal
    const [activeJobId, setActiveJobId] = useState<string | null>(null);

    // Helpers to step dates
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth());
    };

    // Filter Jobs matching search/filters
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            // Must have a booking date to be on calendar
            if (!job.bookingDate) return false;

            const matchesSearch = searchTerm === '' ||
                job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (job.clientDetails?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${job.carDetails.year} ${job.carDetails.make} ${job.carDetails.model}`.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTech = selectedTechId === 'all' ||
                (job.assignedStaff && job.assignedStaff.some(s => s.id === selectedTechId));

            const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;

            return matchesSearch && matchesTech && matchesStatus;
        });
    }, [jobs, searchTerm, selectedTechId, selectedStatus]);

    // Active Job details
    const activeJob = useMemo(() => {
        return jobs.find(j => j.id === activeJobId) || null;
    }, [jobs, activeJobId]);

    // Days of the month generator
    const monthDays = useMemo(() => {
        const days = [];
        const firstDay = new Date(currentYear, currentMonth, 1);
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

        // Gather previous month days for padding
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const prevMonthDaysCount = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const dateStr = `${prevMonthYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevMonthDaysCount - i).padStart(2, '0')}`;
            days.push({
                date: new Date(prevMonthYear, prevMonth, prevMonthDaysCount - i),
                dateString: dateStr,
                isCurrentMonth: false
            });
        }

        // Current month days
        const currentMonthDaysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let i = 1; i <= currentMonthDaysCount; i++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                date: new Date(currentYear, currentMonth, i),
                dateString: dateStr,
                isCurrentMonth: true
            });
        }

        // Next month paddings to perfectly fill grid (multiples of 7 matching row count)
        const totalItemsNeeded = days.length <= 35 ? 35 : 42;
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        let dayCounter = 1;
        while (days.length < totalItemsNeeded) {
            const dateStr = `${nextMonthYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
            days.push({
                date: new Date(nextMonthYear, nextMonth, dayCounter++),
                dateString: dateStr,
                isCurrentMonth: false
            });
        }

        return days;
    }, [currentYear, currentMonth]);

    // Group filtered jobs by bookingDate
    const jobsByDate = useMemo(() => {
        const map: { [date: string]: Job[] } = {};
        filteredJobs.forEach(job => {
            const dateStr = job.bookingDate;
            if (dateStr) {
                if (!map[dateStr]) {
                    map[dateStr] = [];
                }
                map[dateStr].push(job);
            }
        });
        return map;
    }, [filteredJobs]);

    // Active Week dates calculations (centered around first currentMonth monday, or selected week offset)
    const [weekOffset, setWeekOffset] = useState<number>(0); // 0 means starting with first monday of currentMonth
    const weekDays = useMemo(() => {
        // Find first day of selected month-year, or current today week
        const baseDate = new Date(currentYear, currentMonth, 1);
        baseDate.setDate(baseDate.getDate() + (weekOffset * 7));
        // Backtrack to Sunday
        const dayOfWeek = baseDate.getDay();
        baseDate.setDate(baseDate.getDate() - dayOfWeek);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() + i);
            const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            days.push({
                date: d,
                dateString,
                label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            });
        }
        return days;
    }, [currentYear, currentMonth, weekOffset]);

    // Technician Workload calculation
    // Calculate total layout hours for each staff member for filtered jobs
    const technicianWorkload = useMemo(() => {
        const stats: { [techId: string]: { hours: number; jobCount: number } } = {};
        
        // Initialize staff
        shop.staff.forEach(s => {
            stats[s.id] = { hours: 0, jobCount: 0 };
        });
        stats['unassigned'] = { hours: 0, jobCount: 0 };

        filteredJobs.forEach(j => {
            // Default job duration
            let duration = 4; // default hours
            if (j.quote?.items) {
                // If they have labor items, compute total quantity
                const laborItems = j.quote.items.filter(item => item.description.toLowerCase().includes('labor') || item.description.toLowerCase().includes('install'));
                if (laborItems.length > 0) {
                    duration = laborItems.reduce((acc, current) => acc + current.quantity, 0);
                }
            }

            if (j.assignedStaff && j.assignedStaff.length > 0) {
                j.assignedStaff.forEach(s => {
                    if (stats[s.id]) {
                        stats[s.id].hours += duration;
                        stats[s.id].jobCount += 1;
                    }
                });
            } else {
                stats['unassigned'].hours += duration;
                stats['unassigned'].jobCount += 1;
            }
        });

        return stats;
    }, [filteredJobs, shop.staff]);

    // Month Label
    const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    // Helper status background badge color
    const getStatusColor = (status: Job['status']) => {
        switch (status) {
            case 'New': return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
            case 'Estimate': return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800';
            case 'Quote Requested': return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800';
            case 'Quote Provided': return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800';
            case 'Booking Confirmed': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
            case 'In Repair': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            case 'Painting': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
            case 'Final Check': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800';
            case 'Awaiting Payment': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
            case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
            default: return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    // Calculate quick counts for helpers page hint
    const unmappedJobs = useMemo(() => {
        return jobs.filter(j => !j.bookingDate);
    }, [jobs]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 dark:from-white dark:via-indigo-100 dark:to-violet-200 bg-clip-text text-transparent">
                        Shop & Technician Schedule
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Track upcoming appointments, monitor technician workloads, manage assignments, and update repair phases on a clean visual timeline.
                    </p>
                </div>

                {/* View switcher & Quick Jump */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* View selectors */}
                    <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => { setViewType('month'); }}
                            className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all ${viewType === 'month' ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >
                            <span className="hidden sm:inline">Month View</span>
                            <span className="sm:hidden">Month</span>
                        </button>
                        <button
                            onClick={() => { setViewType('week'); setWeekOffset(0); }}
                            className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all ${viewType === 'week' ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >
                            <span className="hidden sm:inline">Week View</span>
                            <span className="sm:hidden">Week</span>
                        </button>
                        <button
                            onClick={() => { setViewType('technician'); }}
                            className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all ${viewType === 'technician' ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >
                            <span className="hidden sm:inline">Technician Dispatch</span>
                            <span className="sm:hidden">Tech</span>
                        </button>
                    </div>

                    {/* August 2024 demo jump */}
                    <button
                        onClick={() => { setCurrentYear(2024); setCurrentMonth(7); }}
                        className="px-3 py-2 text-xs font-medium border border-violet-200 dark:border-violet-800/40 bg-violet-50/50 hover:bg-violet-100/50 dark:bg-violet-900/10 dark:hover:bg-violet-900/20 text-violet-700 dark:text-violet-400 rounded-xl transition"
                    >
                        <span className="hidden sm:inline">Jump to Demo Month (Aug 2024)</span>
                        <span className="sm:hidden">Demo Aug 2024</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                {/* Search */}
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search jobs, customers, vehicles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition outline-none text-slate-800 dark:text-slate-200"
                    />
                </div>

                {/* Technician Picker */}
                <div className="w-full md:w-60">
                    <select
                        value={selectedTechId}
                        onChange={(e) => setSelectedTechId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none text-slate-800 dark:text-slate-200"
                    >
                        <option value="all">🛡️ Filter Technician: All staff</option>
                        {shop.staff.map(member => (
                            <option key={member.id} value={member.id}>🧔 {member.name} ({member.role})</option>
                        ))}
                    </select>
                </div>

                {/* Status Picker */}
                <div className="w-full md:w-60">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none text-slate-800 dark:text-slate-200"
                    >
                        <option value="all">🎨 Filter Status: All phases</option>
                        {['New', 'Estimate', 'Booking Confirmed', 'In Repair', 'Painting', 'Final Check', 'Awaiting Payment', 'Completed', 'Cancelled'].map(st => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                </div>

                {/* Info summary labels */}
                <div className="flex-grow flex items-center justify-end font-mono text-[11px] text-slate-400 space-x-4">
                    <span>Active: <strong className="text-violet-500">{filteredJobs.length}</strong> jobs</span>
                    {unmappedJobs.length > 0 && (
                        <span className="bg-amber-100/50 dark:bg-amber-950/20 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40">
                             ⚠️ {unmappedJobs.length} Unscheduled
                        </span>
                    )}
                </div>
            </div>

            {/* Layout Grid: Left content is visual Calendar, Right content is Technician workloads / schedule helpers */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                
                {/* Visual Calendars Column (3/4 on large viewports) */}
                <div className="xl:col-span-3 space-y-4">
                    
                    {/* Navigation Bar */}
                    <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50 flex items-center justify-between shadow-sm">
                        
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-violet-50 dark:bg-violet-950/30 rounded-xl text-violet-600 dark:text-violet-400">
                                <CalendarDaysIcon className="h-5 w-5" />
                            </span>
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
                                {viewType === 'month' ? monthLabel : `Week of ${weekDays[0].label}`}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={viewType === 'month' ? handlePrevMonth : () => setWeekOffset(prev => prev - 1)}
                                className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition text-slate-600 dark:text-slate-400"
                                title="Previous"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            
                            <button
                                onClick={handleToday}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
                            >
                                Today
                            </button>

                            <button
                                onClick={viewType === 'month' ? handleNextMonth : () => setWeekOffset(prev => prev + 1)}
                                className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition text-slate-600 dark:text-slate-400"
                                title="Next"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* RENDER ACTIVE VIEW */}
                    
                    {/* 1. MONTH VIEW */}
                    {viewType === 'month' && (
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            
                            {/* Days labels */}
                            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 pb-3 text-center text-[11px] font-mono font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500">
                                <div>Sun</div>
                                <div>Mon</div>
                                <div>Tue</div>
                                <div>Wed</div>
                                <div>Thu</div>
                                <div>Fri</div>
                                <div>Sat</div>
                            </div>

                            {/* Calendar Day Cells */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2 mt-2">
                                {monthDays.map((day, idx) => {
                                    const cellJobs = jobsByDate[day.dateString] || [];
                                    const isCurrentToday = new Date().toDateString() === day.date.toDateString();

                                    return (
                                        <div
                                            key={idx}
                                            className={`min-h-[105px] border ${day.isCurrentMonth ? 'border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20' : 'border-slate-50/20 bg-slate-50/30 text-slate-300 dark:bg-slate-900/10 dark:border-transparent dark:text-slate-700'} rounded-2xl p-2 flex flex-col justify-between transition-all group`}
                                        >
                                            {/* Header of Cell */}
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs font-mono font-bold leading-normal p-1 select-none rounded-md ${isCurrentToday ? 'bg-violet-600 text-white font-black scale-105 shadow-sm px-1.5' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {day.date.getDate()}
                                                </span>
                                                
                                                {/* Job counter dot flag */}
                                                {cellJobs.length > 0 && (
                                                    <span className="h-4 min-w-[16px] px-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center rounded-full text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400">
                                                        {cellJobs.length}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Scheduled Jobs elements inside month cell */}
                                            <div className="mt-2 flex-grow space-y-1 overflow-y-auto max-h-[70px] scrollbar-thin">
                                                {cellJobs.slice(0, 3).map(job => {
                                                    const techInitial = job.assignedStaff && job.assignedStaff.length > 0
                                                        ? job.assignedStaff[0].name.split(' ').map(n=>n[0]).join('')
                                                        : '?';

                                                    return (
                                                        <div
                                                            key={job.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveJobId(job.id);
                                                            }}
                                                            className={`text-[9px] font-sans truncate p-1.5 rounded-lg font-medium cursor-pointer transition border border-slate-200 dark:border-slate-800/80 ${getStatusColor(job.status)} hover:scale-[1.02] shadow-sm flex items-center justify-between gap-1`}
                                                            title={`${job.carDetails.year} ${job.carDetails.make} - ${job.status}`}
                                                        >
                                                            <div className="truncate flex-grow">
                                                                <span className="font-bold font-mono mr-1">{job.id.replace('JOB-', '')}</span>
                                                                {job.carDetails.make}
                                                            </div>
                                                            {/* Tech tag */}
                                                            <span 
                                                                className={`h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold ${job.assignedStaff && job.assignedStaff.length > 0 ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400' : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'}`}
                                                                title={job.assignedStaff && job.assignedStaff.length > 0 ? `Assigned Tech: ${job.assignedStaff[0].name}` : 'Unassigned Technician'}
                                                            >
                                                                {techInitial}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                                {cellJobs.length > 3 && (
                                                    <div className="text-[8px] text-center text-slate-400 dark:text-slate-500 font-bold">
                                                        + {cellJobs.length - 3} more
                                                    </div>
                                                )}
                                            </div>

                                            {/* Click to Schedule indicator */}
                                            {day.isCurrentMonth && (
                                                <button
                                                    onClick={() => {
                                                        // Schedule on this date
                                                        // Let's open an unscheduled job modal, or alert
                                                        const unscheduled = jobs.find(j => !j.bookingDate);
                                                        if (unscheduled) {
                                                            onUpdateBookingDate(unscheduled.id, day.dateString);
                                                            setActiveJobId(unscheduled.id);
                                                        } else {
                                                            alert(`Tip: Select a job from the "Unscheduled shelf" on the right sidebar and change its date to ${day.dateString}!`);
                                                        }
                                                    }}
                                                    className="w-full opacity-0 group-hover:opacity-100 text-[8px] py-0.5 mt-1 border border-dashed border-violet-300 dark:border-violet-800 text-violet-500 dark:text-violet-400 rounded-lg text-center font-mono font-medium hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
                                                >
                                                    + Drop Booking
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 2. WEEK VIEW */}
                    {viewType === 'week' && (
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                            {weekDays.map((day, idx) => {
                                const cellJobs = jobsByDate[day.dateString] || [];
                                const isCurrentToday = new Date().toDateString() === day.date.toDateString();

                                return (
                                    <div
                                        key={idx}
                                        className={`bg-white dark:bg-slate-900 border ${isCurrentToday ? 'border-violet-500 dark:border-violet-600 ring-1 ring-violet-500/25' : 'border-slate-200 dark:border-slate-800'} rounded-2xl shadow-sm`}
                                    >
                                        {/* Day label heading */}
                                        <div className={`p-3 rounded-t-2xl font-mono text-center flex flex-col border-b border-slate-100 dark:border-slate-800/60 ${isCurrentToday ? 'bg-violet-500/5 dark:bg-violet-600/5' : ''}`}>
                                            <span className={`text-[10px] font-bold tracking-wider uppercase ${isCurrentToday ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`}>
                                                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                            <span className={`text-base font-black ${isCurrentToday ? 'text-violet-600 dark:text-violet-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {day.date.getDate()}
                                            </span>
                                            <span className="text-[9px] text-slate-400 mt-0.5">
                                                {day.date.toLocaleDateString('en-US', { month: 'short' })}
                                            </span>
                                        </div>

                                        {/* Jobs listed for this day of week */}
                                        <div className="p-2 space-y-2 min-h-[300px] max-h-[450px] overflow-y-auto">
                                            {cellJobs.length === 0 ? (
                                                <div className="text-[10px] text-slate-400 text-center py-10 font-mono italic">
                                                    No slots booked
                                                </div>
                                            ) : (
                                                cellJobs.map(job => (
                                                    <div
                                                        key={job.id}
                                                        onClick={() => setActiveJobId(job.id)}
                                                        className={`p-2.5 rounded-xl border cursor-pointer hover:border-violet-400 dark:hover:border-violet-700 transition shadow-sm relative group bg-white dark:bg-slate-950 ${getStatusColor(job.status)}`}
                                                    >
                                                        <div className="flex items-center justify-between gap-1 mb-1.5">
                                                            <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                                                                {job.id}
                                                            </span>
                                                            <span className="text-[8px] font-bold uppercase tracking-wider opacity-90 px-1 py-0.5 rounded bg-white dark:bg-slate-900 border">
                                                                {job.status}
                                                            </span>
                                                        </div>

                                                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                            {job.carDetails.year} {job.carDetails.make} {job.carDetails.model}
                                                        </div>

                                                        <div className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                                             👤 {job.clientDetails?.name || job.customerEmail}
                                                        </div>

                                                        {/* Tech badge details info */}
                                                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-[9px] text-slate-500">
                                                            <div className="flex items-center gap-1">
                                                                <WrenchScrewdriverIcon className="h-3 w-3 text-slate-400 shrink-0" />
                                                                <span className="truncate max-w-[60px] font-medium">
                                                                    {job.assignedStaff && job.assignedStaff.length > 0 
                                                                        ? job.assignedStaff[0].name.split(' ')[0]
                                                                        : 'Unassigned'}
                                                                </span>
                                                            </div>
                                                            {job.quote?.total && (
                                                                <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
                                                                    ${job.quote.total}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 3. TECHNICIAN DISPATCH TIMELINE VIEW */}
                    {viewType === 'technician' && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            
                            {/* Days Timeline Header */}
                            <div className="grid grid-cols-12 border-b border-slate-100 dark:border-slate-800 pb-3 p-4 bg-slate-50/50 dark:bg-slate-800/10">
                                <div className="col-span-3 text-xs font-bold text-slate-500 uppercase font-mono">Technician Staff</div>
                                <div className="col-span-9 grid grid-cols-7 gap-2 text-center text-[10px] font-mono tracking-wider font-semibold text-slate-400">
                                    {weekDays.map((wd, i) => (
                                        <div key={i} className="flex flex-col">
                                            <span className="uppercase text-[9px]">{wd.date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                            <span className="text-xs font-black text-slate-600 dark:text-slate-300">{wd.date.getDate()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Staff Rows */}
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {shop.staff.map(tech => {
                                    const techJobs = filteredJobs.filter(j => 
                                        j.assignedStaff && j.assignedStaff.some(s => s.id === tech.id)
                                    );

                                    return (
                                        <div key={tech.id} className="grid grid-cols-12 items-center p-4 min-h-[90px] group transition hover:bg-slate-50/20 dark:hover:bg-slate-800/5">
                                            
                                            {/* Tech info column */}
                                            <div className="col-span-3 flex items-center gap-3">
                                                <div className="relative shrink-0">
                                                    {tech.photoUrl ? (
                                                        <img src={tech.photoUrl} alt={tech.name} className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        <span className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                                                            {tech.name[0]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{tech.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tech.role}</div>
                                                </div>
                                            </div>

                                            {/* Week schedules blocks for tech */}
                                            <div className="col-span-9 grid grid-cols-7 gap-2 h-full items-start">
                                                {weekDays.map(wd => {
                                                    const dayJobs = techJobs.filter(j => j.bookingDate === wd.dateString);
                                                    
                                                    return (
                                                        <div key={wd.dateString} className="min-h-[60px] p-1 bg-slate-50/40 dark:bg-slate-900/20 rounded-xl relative border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition">
                                                            {dayJobs.length === 0 ? (
                                                                <span className="absolute inset-0 flex items-center justify-center text-[18px] text-slate-100 dark:text-slate-800/30 opacity-60 font-mono text-center select-none font-bold">
                                                                    -
                                                                </span>
                                                            ) : (
                                                                <div className="space-y-1">
                                                                    {dayJobs.map(job => (
                                                                        <div
                                                                            key={job.id}
                                                                            onClick={() => setActiveJobId(job.id)}
                                                                            className={`text-[9px] font-sans truncate p-1.5 rounded-lg font-semibold cursor-pointer border ${getStatusColor(job.status)} transition shadow-sm hover:scale-105`}
                                                                            title={`${job.id}: ${job.carDetails.year} ${job.carDetails.make} (${job.status})`}
                                                                        >
                                                                            <span className="font-bold text-[8px] font-mono block opacity-75">{job.id}</span>
                                                                            {job.carDetails.make}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                        </div>
                                    );
                                })}

                                {/* Unassigned Row */}
                                <div className="grid grid-cols-12 items-center p-4 min-h-[90px] bg-amber-50/10 dark:bg-amber-950/5 hover:bg-amber-50/20 dark:hover:bg-amber-950/10">
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-2">
                                            <span className="p-1 px-1.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold uppercase">
                                                Unassigned
                                            </span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 mt-1 italic">
                                            Bookings needing dispatch.
                                        </div>
                                    </div>

                                    <div className="col-span-9 grid grid-cols-7 gap-2">
                                        {weekDays.map(wd => {
                                            const dayUnassignedJobs = filteredJobs.filter(j => 
                                                j.bookingDate === wd.dateString && (!j.assignedStaff || j.assignedStaff.length === 0)
                                            );

                                            return (
                                                <div key={wd.dateString} className="min-h-[60px] p-1 rounded-xl">
                                                    {dayUnassignedJobs.length === 0 ? (
                                                        <span className="block text-center text-slate-200 dark:text-slate-800 text-xs py-4">-</span>
                                                    ) : (
                                                        dayUnassignedJobs.map(job => (
                                                            <div
                                                                key={job.id}
                                                                onClick={() => setActiveJobId(job.id)}
                                                                className="text-[9px] font-bold p-1 border border-dashed border-amber-300 dark:border-amber-800/60 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 rounded-lg truncate cursor-pointer hover:bg-amber-100"
                                                                title={`${job.id}: ${job.carDetails.make}`}
                                                            >
                                                                ⚠️ {job.id}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>

                {/* Right Sidebar: Technician Schedule Distribution & Unscheduled Shelf (1/4 Column) */}
                <div className="space-y-6">
                    
                    {/* Panel 1: Technician Workloads & Capacities */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                                Technician Dispatch Hrs
                            </h2>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-500">
                                40h Limit
                            </span>
                        </div>

                        <div className="space-y-4 font-sans">
                            {shop.staff.map(tech => {
                                const stats = technicianWorkload[tech.id] || { hours: 0, jobCount: 0 };
                                const pct = Math.min(100, Math.round((stats.hours / 40) * 100));
                                
                                return (
                                    <div key={tech.id} className="space-y-1.5 text-xs">
                                        <div className="flex items-center justify-between font-medium">
                                            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                                                <span className="font-bold">{tech.name.split(' ')[0]}</span>
                                                <span className="text-[10px] text-slate-400">({tech.role})</span>
                                            </div>
                                            <span className="font-mono text-slate-500 font-bold">
                                                {stats.hours} hrs <span className="text-[10px] text-slate-300">/ {stats.jobCount} jobs</span>
                                            </span>
                                        </div>

                                        {/* Progress Bar of Capacity status */}
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {technicianWorkload['unassigned']?.jobCount > 0 && (
                                <div className="p-3 bg-red-50/50 dark:bg-red-950/10 border border-dashed border-red-200 dark:border-red-900/40 rounded-2xl flex items-center justify-between text-xs text-red-800 dark:text-red-400 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                        <span><strong>{technicianWorkload['unassigned'].jobCount}</strong> Bookings Unassigned</span>
                                    </div>
                                    <span className="text-[10px] bg-red-100 dark:bg-red-900/30 font-bold px-2 py-0.5 rounded-full font-mono">
                                        + {technicianWorkload['unassigned'].hours}h
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel 2: Unscheduled Bookings Container */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div>
                            <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                                Unscheduled Jobs shelf
                            </h2>
                            <p className="text-[10px] text-slate-500 mt-1">
                                Click a card to assign a booking date and technician directly.
                             </p>
                        </div>

                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                            {unmappedJobs.length === 0 ? (
                                <div className="text-xs text-slate-400 dark:text-slate-500 py-10 text-center font-mono italic bg-slate-50/50 dark:bg-slate-800/10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                    🎯 All active jobs scheduled!
                                </div>
                            ) : (
                                unmappedJobs.map(job => (
                                    <div
                                        key={job.id}
                                        onClick={() => {
                                            setActiveJobId(job.id);
                                        }}
                                        className="p-3 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl cursor-pointer hover:shadow-sm transition-all group duration-200"
                                    >
                                        <div className="flex items-center justify-between gap-1 mb-1.5">
                                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-white dark:bg-slate-800 border border-slate-100 rounded px-1.5 py-0.5">
                                                {job.id}
                                            </span>
                                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-transparent ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </div>

                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                            {job.carDetails.year} {job.carDetails.make} {job.carDetails.model}
                                        </div>
                                        
                                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                                             👤 {job.clientDetails?.name || job.customerEmail}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
                                            {job.quote?.total ? (
                                                <span>Total: <strong>${job.quote.total}</strong></span>
                                            ) : (
                                                <span>Awaiting Quote</span>
                                            )}
                                            <span className="text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-all font-sans font-semibold flex items-center gap-0.5">
                                                Schedule <ArrowRightIcon className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </div>

            {/* INTERACTIVE DETAIL OVERLAY (DRAWER / SLIDE-IN MODAL) */}
            <AnimatePresence>
                {activeJob && (
                    <>
                        {/* Backdrop close mask */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveJobId(null)}
                            className="fixed inset-0 bg-black z-40"
                        />

                        {/* Interactive edit panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-y-auto p-6 flex flex-col justify-between"
                        >
                            
                            {/* Drawer Content */}
                            <div className="space-y-6">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                                                {activeJob.id}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                Last updated {new Date(activeJob.lastUpdate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                                             Job Details & Dispatch
                                        </h3>
                                    </div>
                                    
                                    <button
                                        onClick={() => setActiveJobId(null)}
                                        className="p-1 px-1.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60 hover:opacity-100 transition text-slate-600 dark:text-slate-400"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Vehicle Information */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                                        <WrenchScrewdriverIcon className="h-4 w-4 text-violet-500" />
                                        <span>Vehicle Specs</span>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div>
                                            <div className="text-base font-bold text-slate-800 dark:text-slate-200">
                                                {activeJob.carDetails.year} {activeJob.carDetails.make} {activeJob.carDetails.model}
                                            </div>
                                            <div className="text-[10px] font-mono text-slate-400 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                                <span>VIN: {activeJob.carDetails.vin || 'Not Provided'}</span>
                                                <span>Plate: {activeJob.carDetails.registrationNo || 'Not Provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Client details */}
                                <div className="space-y-1 text-xs">
                                    <span className="font-mono text-slate-400 font-bold uppercase tracking-widest block mb-2">Customer Info</span>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 text-slate-700 dark:text-slate-300">
                                        <div>🧔 <strong>Name:</strong> {activeJob.clientDetails?.name || 'Awaiting Input'}</div>
                                        <div>✉️ <strong>Email:</strong> {activeJob.customerEmail}</div>
                                        {activeJob.clientDetails?.address && (
                                            <div>📍 <strong>Address:</strong> {activeJob.clientDetails.address}</div>
                                        )}
                                    </div>
                                </div>

                                {/* FORM 1: SCHEDULE BOOKING DATE */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                                         📅 Appointment Booking Date
                                    </label>
                                    <input
                                        type="date"
                                        value={activeJob.bookingDate || ''}
                                        onChange={(e) => {
                                            onUpdateBookingDate(activeJob.id, e.target.value);
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                                    />
                                    <p className="text-[10px] text-slate-400 font-mono">
                                        Changing this triggers instant calendar rescheduling and alerts the assigned mechanic.
                                    </p>
                                </div>

                                {/* FORM 2: ASSIGNED TECHNICIAN (STAFF DISPATCH) */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                                         🧔 Assigned Tech (Dispatch)
                                    </label>
                                    <select
                                        value={activeJob.assignedStaff && activeJob.assignedStaff.length > 0 ? activeJob.assignedStaff[0].id : ''}
                                        onChange={(e) => {
                                            const selectedStaffMember = shop.staff.find(s => s.id === e.target.value);
                                            onUpdateStaff(activeJob.id, selectedStaffMember ? [selectedStaffMember] : []);
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition font-semibold text-slate-800 dark:text-slate-200"
                                    >
                                        <option value="">🚫 Unassigned / Awaiting Dispatch</option>
                                        {shop.staff.map(member => (
                                            <option key={member.id} value={member.id}>🧔 {member.name} ({member.role})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* FORM 3: REPAIR STATUS */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                                         ⭐ Repair Phase (Status)
                                    </label>
                                    <select
                                        value={activeJob.status}
                                        onChange={(e) => {
                                            onUpdateStatus(activeJob.id, e.target.value as JobStatus);
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition font-semibold text-slate-800 dark:text-slate-200"
                                    >
                                        {['New', 'Estimate', 'Quote Requested', 'Quote Provided', 'Booking Confirmed', 'In Repair', 'Painting', 'Final Check', 'Awaiting Payment', 'Completed', 'Cancelled'].map(st => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Services list */}
                                {activeJob.quote && activeJob.quote.items && (
                                    <div className="space-y-2">
                                        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                                             🏷️ Booked Services ({activeJob.quote.items.length})
                                        </div>
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1.5">
                                            {activeJob.quote.items.map((srv, index) => (
                                                <div key={index} className="flex justify-between pt-1.5 first:pt-0">
                                                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                                                        {srv.description} <span className="text-[10px] font-mono text-slate-400">x{srv.quantity}</span>
                                                    </span>
                                                    <span className="font-mono text-slate-500">${srv.price * srv.quantity}</span>
                                                </div>
                                            ))}
                                            <div className="pt-2 font-bold flex justify-between border-t border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-mono">
                                                <span>Total Bill:</span>
                                                <span>${activeJob.quote.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* View Full details action trigger */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                                <button
                                    onClick={() => {
                                        setActiveJobId(null);
                                        onSelectJob(activeJob);
                                    }}
                                    className="flex-grow bg-violet-600 dark:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transform hover:scale-[1.01] hover:bg-violet-700 dark:hover:bg-violet-600 transition text-xs shadow-sm shadow-violet-500/10 flex items-center justify-center gap-1.5"
                                >
                                    <ShieldCheckIcon className="h-4 w-4" />
                                    Go to Job Action Center
                                </button>
                                
                                <button
                                    onClick={() => setActiveJobId(null)}
                                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 border border-transparent text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                                >
                                    Dismiss
                                </button>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
};
