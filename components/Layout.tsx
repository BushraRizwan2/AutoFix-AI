
import React, { useState } from 'react';
import { User } from '../types';
import { NavItem } from '../navConfig';
import { CarIcon } from './icons/CarIcon';
import { ArrowRightOnRectangleIcon } from './icons/ArrowRightOnRectangleIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { useNotifications } from '../contexts/NotificationContext';

interface LayoutProps {
    user: User;
    onLogout: () => void;
    navItems: NavItem[];
    activePage: string;
    onNavigate: (page: any) => void;
    title: string;
    children: React.ReactNode;
    onOpenSettings: () => void;
}

const NavItemBadge: React.FC<{count: number}> = ({ count }) => {
    if (count === 0) return null;
    return (
        <span className="absolute top-1 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white ring-2 ring-white dark:ring-slate-900">
            {count}
        </span>
    );
};


const SidebarNavItem: React.FC<{
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
    badgeCount?: number;
}> = ({ item, isActive, onClick, badgeCount = 0 }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className={`relative flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isActive 
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        }`}
    >
        <item.icon className={`h-6 w-6 transition-colors group-hover:text-slate-800 dark:group-hover:text-white ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-500'}`} />
        <span className="ml-3">{item.label}</span>
        {badgeCount > 0 && <NavItemBadge count={badgeCount} />}
    </a>
);

const MobileNavItem: React.FC<{
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
    isCenter?: boolean;
    badgeCount?: number;
}> = ({ item, isActive, onClick, isCenter, badgeCount = 0 }) => {
    if (item.id === 'placeholder' || item.id.startsWith('placeholder')) {
        return <div className="flex-1"></div>;
    }
    return (
        <button onClick={onClick} className="relative flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors group">
            {isCenter ? (
                <div className={`relative -top-6 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white transition-all duration-300 shadow-2xl shadow-violet-500/50`}>
                    <item.icon className="h-8 w-8" />
                </div>
            ) : (
                <item.icon className={`h-6 w-6 transition-colors ${isActive ? 'text-violet-500 dark:text-violet-400' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
            )}
            <span className={`transition-colors ${isCenter ? 'sr-only' : ''} ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                {item.label}
            </span>
             {badgeCount > 0 && !isCenter && <span className="absolute top-0 right-1/4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">{badgeCount}</span>}
        </button>
    );
};

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, navItems, activePage, onNavigate, title, children, onOpenSettings }) => {
    const mobileNavOrder = navItems.filter(item => item.mobile);
    const { unreadCount } = useNotifications();

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800">
                <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-cyan-500 dark:text-cyan-400">
                        <CarIcon className="h-8 w-8" />
                        <span className="text-xl font-bold text-slate-800 dark:text-white">AutoFix AI</span>
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-2">
                    <nav>
                        {navItems.map(item => {
                            if (item.id.startsWith('placeholder')) return null;
                            return (
                                <SidebarNavItem 
                                    key={item.id}
                                    item={item}
                                    isActive={activePage === item.id}
                                    onClick={() => onNavigate(item.id)}
                                    badgeCount={item.id === 'notifications' ? unreadCount : 0}
                                />
                            )
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                    <div className="mb-4 p-3 bg-gray-100 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center">
                            <UserCircleIcon className="h-8 w-8 text-slate-500" />
                            <div className="ml-3 overflow-hidden">
                                 <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{title}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            <span className="ml-3">Logout</span>
                        </button>
                        <button
                            onClick={onOpenSettings}
                            className="flex-shrink-0 px-3 py-2 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
                            aria-label="Open Settings"
                        >
                           <Cog6ToothIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-800/50 sticky top-0 z-30">
                    <div className="flex items-center gap-2 text-violet-500 dark:text-violet-400">
                        <CarIcon className="h-6 w-6" />
                        <span className="text-lg font-bold text-slate-800 dark:text-white">AutoFix AI</span>
                    </div>
                    <h1 className="text-base font-semibold text-slate-700 dark:text-slate-300 truncate">{navItems.find(item => item.id === activePage)?.label || title}</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                    {children}
                </main>
            </div>
            
            {/* Mobile Footer Navigation */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-slate-800/50">
                <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
                    {mobileNavOrder.map((item, index) => (
                         <MobileNavItem 
                            key={item.id}
                            item={item}
                            isActive={activePage === item.id}
                            onClick={() => onNavigate(item.id)}
                            isCenter={index === 2}
                            badgeCount={item.id === 'notifications' ? unreadCount : 0}
                        />
                    ))}
                </div>
            </footer>
        </div>
    );
};