
import React, { useState } from 'react';
import { StaffMember } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: StaffMember) => void;
  memberToEdit?: StaffMember;
}

const emptyStaff: Omit<StaffMember, 'id'|'performanceNotes'> = {
    name: '',
    role: 'Bodytech',
    email: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
    address: { street: '', city: '', state: '', zip: '' },
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop', // Default photo
    salary: 40000,
};

export const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSave, memberToEdit }) => {
  const [member, setMember] = useState(memberToEdit || emptyStaff);

  const handleChange = (field: keyof Omit<StaffMember, 'id'|'address'|'performanceNotes'>, value: any) => {
    setMember(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddressChange = (field: keyof StaffMember['address'], value: string) => {
      setMember(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member.name || !member.email) return;

    const finalMember: StaffMember = {
        ...member,
        id: memberToEdit?.id || `staff-${Date.now()}`,
        performanceNotes: memberToEdit?.performanceNotes || []
    };
    onSave(finalMember);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-lg m-4 p-8 border border-slate-200 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/50 border-2 border-violet-200 dark:border-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlusIcon className="h-8 w-8 text-violet-500 dark:text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{memberToEdit ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input type="text" value={member.name} onChange={(e) => handleChange('name', e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <select value={member.role} onChange={(e) => handleChange('role', e.target.value)} className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg">
                        <option>Estimator</option><option>Bodytech</option><option>Painter</option><option>Detailer</option><option>Manager</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input type="email" value={member.email} onChange={(e) => handleChange('email', e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                    <input type="tel" value={member.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Photo URL</label>
                    <input type="text" value={member.photoUrl} onChange={(e) => handleChange('photoUrl', e.target.value)} className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hire Date</label>
                    <input type="date" value={member.hireDate} onChange={(e) => handleChange('hireDate', e.target.value)} className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary</label>
                    <input type="number" value={member.salary} onChange={(e) => handleChange('salary', Number(e.target.value))} className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg"/>
                </div>
            </div>
          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 rounded-lg">
            {memberToEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </form>
      </div>
    </div>
  );
};
