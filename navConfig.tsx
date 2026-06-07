
import React from 'react';
import { HomeIcon } from './components/icons/HomeIcon';
import { WrenchScrewdriverIcon } from './components/icons/WrenchScrewdriverIcon';
import { UserCircleIcon } from './components/icons/UserCircleIcon';
import { BellIcon } from './components/icons/BellIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ChartBarIcon } from './components/icons/ChartBarIcon';
import { BuildingStorefrontIcon } from './components/icons/BuildingStorefrontIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { Cog6ToothIcon } from './components/icons/Cog6ToothIcon';
import { QuestionMarkCircleIcon } from './components/icons/QuestionMarkCircleIcon';
import { TicketIcon } from './components/icons/TicketIcon';
import { UsersGroupIcon } from './components/icons/UsersGroupIcon';
import { ClipboardDocumentListIcon } from './components/icons/ClipboardDocumentListIcon';
import { CubeIcon } from './components/icons/CubeIcon';
import { DocumentChartBarIcon } from './components/icons/DocumentChartBarIcon';
import { BanknotesIcon } from './components/icons/BanknotesIcon';
import { CalendarDaysIcon } from './components/icons/CalendarDaysIcon';

export interface NavItem {
    id: string;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    mobile: boolean; // Show in mobile footer nav
}

export const customerNavItems: NavItem[] = [
    { id: 'new_estimate', label: 'New Estimate', icon: SparklesIcon, mobile: true },
    { id: 'notifications', label: 'Updates', icon: BellIcon, mobile: true },
    { id: 'bookings', label: 'My Bookings', icon: HomeIcon, mobile: true },
    { id: 'support_chat', label: 'Support', icon: QuestionMarkCircleIcon, mobile: true },
    { id: 'profile', label: 'My Profile', icon: UserCircleIcon, mobile: true },
];

export const shopNavItems: NavItem[] = [
    { id: 'workflow', label: 'Workflow', icon: ChartBarIcon, mobile: true },
    { id: 'calendar', label: 'Calendar', icon: CalendarDaysIcon, mobile: true },
    { id: 'jobs', label: 'All Jobs', icon: WrenchScrewdriverIcon, mobile: true },
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, mobile: true },
    { id: 'staff', label: 'Staff', icon: UsersGroupIcon, mobile: true },
    { id: 'profile', label: 'My Shop', icon: BuildingStorefrontIcon, mobile: true },
    // Non-mobile items
    { id: 'services', label: 'Services', icon: ClipboardDocumentListIcon, mobile: false },
    { id: 'parts', label: 'Parts', icon: CubeIcon, mobile: false },
    { id: 'earnings', label: 'Earnings', icon: BanknotesIcon, mobile: false },
];

export const adminNavItems: NavItem[] = [
    { id: 'shops', label: 'Manage Shops', icon: BuildingStorefrontIcon, mobile: true },
    { id: 'users', label: 'Manage Users', icon: UsersIcon, mobile: true },
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, mobile: true },
    { id: 'support', label: 'Support Center', icon: TicketIcon, mobile: true },
    { id: 'analytics', label: 'Analytics', icon: DocumentChartBarIcon, mobile: true },
    // Non-mobile item
    { id: 'transactions', label: 'Transactions', icon: BanknotesIcon, mobile: false },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, mobile: false },
];
