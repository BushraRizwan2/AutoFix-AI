
import React, { useState, useEffect } from 'react';
import { User, Job, Shop, AdminPage, SupportTicket, UserRole, ManagedUser, AppSettings, UserType } from '../types';
import { AdminDashboard } from './admin/AdminDashboard';
import { Layout } from '../components/Layout';
import { adminNavItems } from '../navConfig';
import { ManagementTable } from './admin/ManagementTable';
import { SupportChatsPage } from './admin/SupportChatsPage';
import { ShopDetailsPage } from './admin/ShopDetailsPage';
import { AnalyticsPage } from './admin/AnalyticsPage';
import { TransactionsPage } from './admin/TransactionsPage';
import { UserDetailsPage } from './admin/UserDetailsPage';
import { SettingsModal } from '../components/SettingsModal';
import { ProfilePage } from '../components/ProfilePage';
import { UserManagementPage } from './admin/UserManagementPage';
import { AddUserModal } from '../components/AddUserModal';


interface AdminPortalProps {
    user: User;
    onLogout: () => void;
    jobs: Job[];
    shops: Shop[];
    supportTickets: SupportTicket[];
    onSendSupportMessage: (ticketId: string, messageText: string, sender: 'customer' | 'admin') => void;
    onUpdateShop: (shopId: number, updates: Partial<Shop>) => void;
    settings: AppSettings;
    onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ user, onLogout, jobs, shops, supportTickets, onSendSupportMessage, onUpdateShop, settings, onUpdateSettings }) => {
    const [activePage, setActivePage] = useState<AdminPage>('analytics');
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);

    useEffect(() => {
        const userEmails = [...new Set(jobs.map(j => j.customerEmail))];
        const allUsers: ManagedUser[] = userEmails.map(email => {
            const userJobs = jobs.filter(job => job.customerEmail === email);
            const latestJob = userJobs.sort((a,b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())[0];
            
            // Mocking business user logic for demo
            const isBusiness = email.includes('david') || email.includes('emily');
            
            return {
                email,
                role: 'customer',
                userType: isBusiness ? 'Business' : 'Standard',
                primaryShopId: isBusiness ? userJobs.find(j => j.shop)?.shop.id : undefined,
                jobCount: userJobs.length,
                totalSpent: userJobs.reduce((acc, j) => acc + (j.invoice?.total || 0), 0),
                lastActivity: latestJob.lastUpdate,
            };
        });
        setManagedUsers(allUsers);
    }, [jobs]);

    const handleAddUser = (newUser: Omit<User, 'role'>) => {
        const userToAdd: ManagedUser = {
            ...newUser,
            role: 'customer',
            jobCount: 0,
            totalSpent: 0,
            lastActivity: new Date().toISOString(),
            userType: newUser.userType || 'Standard',
        };
        setManagedUsers(prev => [userToAdd, ...prev]);
        setIsAddUserModalOpen(false);
    };


    const handleNavigate = (page: AdminPage) => {
        setActivePage(page);
        setSelectedShop(null);
        setSelectedUser(null);
        setSelectedTicket(null);
    }
    
    const handleSelectShop = (shop: Shop) => {
        setSelectedShop(shop);
        setActivePage('shops');
    }
    
     const handleSelectUser = (user: ManagedUser) => {
        setSelectedUser(user);
        setActivePage('users');
    };
    
    const handleSelectTicket = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
    }

    const handleBack = () => {
        setSelectedShop(null);
        setSelectedUser(null);
        setSelectedTicket(null);
    }


    const shopColumns = [
        { header: 'Shop Name', accessor: 'name' },
        { header: 'Address', accessor: 'address' },
        { header: 'Status', accessor: 'status' },
        { header: 'Rating', accessor: 'rating' },
    ];
    
    const renderPage = () => {
        if (selectedShop) {
            return <ShopDetailsPage shop={selectedShop} onUpdateShop={onUpdateShop} onBack={handleBack} />
        }
        
        if (selectedUser) {
            return <UserDetailsPage 
                        user={selectedUser} 
                        jobs={jobs.filter(j => j.customerEmail === selectedUser.email)}
                        onBack={handleBack} 
                    />
        }

        switch (activePage) {
            case 'dashboard':
                return <AdminDashboard jobs={jobs} shops={shops} users={managedUsers} onNavigate={handleNavigate} onSelectShop={handleSelectShop} />;
            case 'shops':
                 return <ManagementTable 
                    title="Shop Management"
                    description="Approve, suspend, or manage body shops on the platform."
                    columns={shopColumns}
                    data={shops}
                    onManageClick={handleSelectShop}
                />;
            case 'users':
                  return <UserManagementPage
                    users={managedUsers}
                    onManageClick={handleSelectUser}
                    onAddUserClick={() => setIsAddUserModalOpen(true)}
                  />;
            case 'analytics':
                return <AnalyticsPage jobs={jobs} shops={shops} users={managedUsers} onNavigate={handleNavigate} />;
            case 'transactions':
                return <TransactionsPage jobs={jobs} />;
            case 'support':
                return <SupportChatsPage 
                            tickets={supportTickets} 
                            selectedTicket={selectedTicket}
                            onSelectTicket={handleSelectTicket}
                            onSendMessage={(msg) => selectedTicket && onSendSupportMessage(selectedTicket.id, msg, 'admin')}
                            onBack={handleBack}
                        />;
            case 'settings':
                 return <ProfilePage user={user} onLogout={onLogout} onOpenSettings={() => setIsSettingsModalOpen(true)} />;
            default:
                return <AdminDashboard jobs={jobs} shops={shops} users={managedUsers} onNavigate={handleNavigate} onSelectShop={handleSelectShop} />;
        }
    }
    
    return (
        <>
            <Layout
                user={user}
                onLogout={onLogout}
                navItems={adminNavItems}
                activePage={activePage}
                onNavigate={(page) => handleNavigate(page as AdminPage)}
                title="Admin Control Panel"
                onOpenSettings={() => setIsSettingsModalOpen(true)}
            >
                {renderPage()}
            </Layout>
            {isSettingsModalOpen && (
                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    settings={settings}
                    onUpdateSettings={onUpdateSettings}
                />
            )}
            {isAddUserModalOpen && (
                 <AddUserModal
                    isOpen={isAddUserModalOpen}
                    onClose={() => setIsAddUserModalOpen(false)}
                    onAddUser={handleAddUser}
                    shops={shops.filter(s => s.status === 'Approved')}
                 />
            )}
        </>
    );
};
