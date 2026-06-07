
import React, { useState, useMemo } from 'react';
import { StaffMember } from '../../types';
import { AddStaffModal } from '../../components/AddStaffModal';
import { MagnifyingGlassIcon } from '../../components/icons/MagnifyingGlassIcon';
import { UserPlusIcon } from '../../components/icons/UserPlusIcon';
import { UserCircleIcon } from '../../components/icons/UserCircleIcon';
import { BriefcaseIcon } from '../../components/icons/BriefcaseIcon';
import { ClipboardDocumentListIcon } from '../../components/icons/ClipboardDocumentListIcon';
import { AtSymbolIcon } from '../../components/icons/AtSymbolIcon';
import { PhoneIcon } from '../../components/icons/PhoneIcon';
import { CalendarDaysIcon } from '../../components/icons/CalendarDaysIcon';
import { MapPinIcon } from '../../components/icons/MapPinIcon';
import { PencilSquareIcon } from '../../components/icons/PencilSquareIcon';
import { CurrencyDollarIcon } from '../../components/icons/CurrencyDollarIcon';


interface StaffRecordManagementPageProps {
  staff: StaffMember[];
  onUpdateStaff: (staff: StaffMember[]) => void;
}

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; icon: React.FC<any>; label: string }> = ({ isActive, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 group ${
            isActive 
            ? 'bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/70'
        }`}
    >
        <Icon className="h-5 w-5" />
        <span className="hidden sm:inline">{label}</span>
    </button>
);

const EditableField: React.FC<{label: string, value: string | number, onSave: (value: string | number) => void, type?: string, icon: React.FC<any>}> = ({label, value, onSave, type = 'text', icon: Icon}) => {
    const [currentValue, setCurrentValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        onSave(currentValue);
        setIsEditing(false);
    }
    
    return (
        <div className="flex items-start gap-3 py-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
             <div className="mt-1 flex-shrink-0">
                <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex-grow">
                <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
                {isEditing ? (
                    <input 
                        type={type} 
                        value={currentValue}
                        onChange={(e) => setCurrentValue(type === 'number' ? Number(e.target.value) : e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        autoFocus
                        className="w-full text-sm font-semibold bg-transparent border-0 border-b-2 border-violet-500 focus:ring-0 p-0 text-slate-900 dark:text-white"
                    />
                ) : (
                    <p onDoubleClick={() => setIsEditing(true)} className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {label === 'Salary' && typeof value === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value) : value}
                    </p>
                )}
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="text-slate-500 hover:text-violet-500 p-1">
                <PencilSquareIcon className="h-4 w-4"/>
            </button>
        </div>
    )
}

export const StaffRecordManagementPage: React.FC<StaffRecordManagementPageProps> = ({ staff, onUpdateStaff }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'performance'>('personal');

    const filteredStaff = useMemo(() => {
        return staff.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [staff, searchTerm]);

    const handleUpdateMember = (id: string, updates: Partial<StaffMember>) => {
        const updatedStaffList = staff.map(member =>
            member.id === id ? { ...member, ...updates } : member
        );
        onUpdateStaff(updatedStaffList);
        // Update selectedStaff as well if it's the one being edited
        if(selectedStaff && selectedStaff.id === id) {
            setSelectedStaff(prev => prev ? { ...prev, ...updates } : null);
        }
    };
    
    const handleAddNote = (staffId: string, noteText: string) => {
        const member = staff.find(s => s.id === staffId);
        if(!member) return;

        const newNote = {
            date: new Date().toISOString(),
            note: noteText,
            reviewer: "Shop Manager" // Assuming current user is manager
        };
        const updatedNotes = [...member.performanceNotes, newNote];
        handleUpdateMember(staffId, { performanceNotes: updatedNotes });
    }

    const StaffList = () => (
        <>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="relative flex-grow w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition text-slate-900 dark:text-white"
                    />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-2 sm:px-5 sm:py-2 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <UserPlusIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Add Staff</span>
                </button>
            </div>
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold text-left">Staff Member</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-left">Contact</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map(member => (
                                <tr key={member.id} onClick={() => setSelectedStaff(member)} className="cursor-pointer border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={member.photoUrl} alt={member.name} className="h-10 w-10 rounded-full object-cover"/>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{member.email}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{member.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    const StaffDetails = () => {
        if (!selectedStaff) return null;
        const [note, setNote] = useState('');

        return (
            <div className="animate-in fade-in duration-300">
                <button onClick={() => setSelectedStaff(null)} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors mb-4">
                    &larr; Back to all staff
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Panel: Profile Card */}
                    <div className="md:col-span-1 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 text-center h-fit">
                        <img src={selectedStaff.photoUrl} alt={selectedStaff.name} className="h-28 w-28 rounded-full object-cover mx-auto ring-4 ring-white dark:ring-slate-800 shadow-lg" />
                        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{selectedStaff.name}</h2>
                        <p className="text-violet-500 dark:text-violet-400 font-semibold">{selectedStaff.role}</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 break-all">{selectedStaff.email}</p>
                    </div>

                    {/* Right Panel: Details */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6">
                         <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                            <TabButton isActive={activeTab === 'personal'} onClick={() => setActiveTab('personal')} icon={UserCircleIcon} label="Personal" />
                            <TabButton isActive={activeTab === 'employment'} onClick={() => setActiveTab('employment')} icon={BriefcaseIcon} label="Employment" />
                            <TabButton isActive={activeTab === 'performance'} onClick={() => setActiveTab('performance')} icon={ClipboardDocumentListIcon} label="Performance" />
                        </div>
                        
                        {activeTab === 'personal' && (
                            <div className="animate-in fade-in-5 duration-300">
                                <EditableField label="Email" value={selectedStaff.email} onSave={(val) => handleUpdateMember(selectedStaff.id, { email: String(val) })} icon={AtSymbolIcon} type="email" />
                                <EditableField label="Phone" value={selectedStaff.phone} onSave={(val) => handleUpdateMember(selectedStaff.id, { phone: String(val) })} icon={PhoneIcon} type="tel" />
                                <EditableField label="Address" value={`${selectedStaff.address.street}, ${selectedStaff.address.city}`} onSave={(val) => handleUpdateMember(selectedStaff.id, { address: {...selectedStaff.address, street: String(val)} })} icon={MapPinIcon} />
                            </div>
                        )}
                        {activeTab === 'employment' && (
                             <div className="animate-in fade-in-5 duration-300">
                                <EditableField label="Hire Date" value={selectedStaff.hireDate} onSave={(val) => handleUpdateMember(selectedStaff.id, { hireDate: String(val) })} icon={CalendarDaysIcon} type="date" />
                                <EditableField label="Salary" value={selectedStaff.salary} onSave={(val) => handleUpdateMember(selectedStaff.id, { salary: Number(val) })} icon={CurrencyDollarIcon} type="number" />
                            </div>
                        )}
                        {activeTab === 'performance' && (
                             <div className="animate-in fade-in-5 duration-300">
                                <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-2">Performance Log</h4>
                                <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
                                    {selectedStaff.performanceNotes.map((note, idx) => (
                                        <div key={idx} className="text-sm p-2 bg-slate-100 dark:bg-slate-800/70 rounded-md">
                                            <p className="text-slate-700 dark:text-slate-300">{note.note}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1">- {note.reviewer} on {new Date(note.date).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                    {selectedStaff.performanceNotes.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No notes yet.</p>}
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Add a new note..." value={note} onChange={e => setNote(e.target.value)} className="flex-grow p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg"/>
                                    <button onClick={() => { handleAddNote(selectedStaff.id, note); setNote(''); }} className="bg-violet-500 text-white font-semibold px-4 py-2 text-sm rounded-lg">Add Note</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Staff Management</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Add, view, and manage your shop's technicians and employee records.
                </p>
            </div>

            {selectedStaff ? <StaffDetails /> : <StaffList />}
            
            {isAddModalOpen && (
                <AddStaffModal 
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={(newMember) => onUpdateStaff([...staff, newMember])}
                />
            )}
        </div>
    );
};