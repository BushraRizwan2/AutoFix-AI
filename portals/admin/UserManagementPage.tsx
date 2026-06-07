import React, { useState, useMemo } from 'react';
import { ManagedUser, UserType } from '../../types';
import { MagnifyingGlassIcon } from '../../components/icons/MagnifyingGlassIcon';
import { UserPlusIcon } from '../../components/icons/UserPlusIcon';
import { BriefcaseIcon } from '../../components/icons/BriefcaseIcon';
import { UserCircleIcon } from '../../components/icons/UserCircleIcon';

interface UserManagementPageProps {
  users: ManagedUser[];
  onManageClick: (user: ManagedUser) => void;
  onAddUserClick: () => void;
}

const FilterButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
            isActive 
            ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/40'
            : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500/50'
        }`}
    >
        {children}
    </button>
);

export const UserManagementPage: React.FC<UserManagementPageProps> = ({ users, onManageClick, onAddUserClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userTypeFilter, setUserTypeFilter] = useState<UserType | 'All'>('All');
    
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = userTypeFilter === 'All' || user.userType === userTypeFilter;
            return matchesSearch && matchesType;
        }).sort((a,b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    }, [users, searchTerm, userTypeFilter]);

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}k`;
        }
        return `$${amount.toFixed(0)}`;
    };
    
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            View, filter, and manage all registered users on the platform.
          </p>
        </div>
        <button
          onClick={onAddUserClick}
          className="flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-2.5 sm:px-5 sm:py-2.5 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          <UserPlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Add User</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by user email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
            <FilterButton isActive={userTypeFilter === 'All'} onClick={() => setUserTypeFilter('All')}>All</FilterButton>
            <FilterButton isActive={userTypeFilter === 'Standard'} onClick={() => setUserTypeFilter('Standard')}>Standard</FilterButton>
            <FilterButton isActive={userTypeFilter === 'Business'} onClick={() => setUserTypeFilter('Business')}>Business</FilterButton>
        </div>
      </div>
      
      {filteredUsers.length > 0 ? (
        <div className="bg-white dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-800/50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th scope="col" className="p-4 font-semibold text-left">User</th>
                            <th scope="col" className="p-4 font-semibold text-left">Type</th>
                            <th scope="col" className="p-4 font-semibold text-center">Jobs</th>
                            <th scope="col" className="p-4 font-semibold text-center">Spent</th>
                            <th scope="col" className="p-4 font-semibold text-left">Last Active</th>
                            <th scope="col" className="p-4 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.email} className="border-b border-slate-200 dark:border-slate-800 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-8 w-8 text-slate-400 flex-shrink-0" />
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white break-all">{user.email}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                                        user.userType === 'Business' 
                                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400' 
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400'
                                    }`}>
                                        {user.userType === 'Business' && <BriefcaseIcon className="h-3 w-3" />}
                                        {user.userType}
                                    </span>
                                </td>
                                <td className="p-4 text-center font-medium text-slate-700 dark:text-slate-300">{user.jobCount}</td>
                                <td className="p-4 text-center font-medium text-slate-700 dark:text-slate-300">{formatCurrency(user.totalSpent)}</td>
                                <td className="p-4 text-slate-600 dark:text-slate-400">{timeSince(user.lastActivity)}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => onManageClick(user)} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      ) : (
        <div className="text-center bg-white dark:bg-slate-900/50 rounded-2xl p-12 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">No Users Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">No users match the current search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};