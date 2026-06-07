import React, { useState } from 'react';
import { Job, ClientDetails, StaffMember, Part, ManualQuote } from '../../types';
import { ChatInterface } from '../../components/ChatInterface';
import { JobStatusTracker } from '../../components/JobStatusTracker';
import { CarDetailsForm } from '../../components/CarDetailsForm';
import { extractDetailsFromDriversLicense } from '../../services/geminiService';
import { ImageUploader } from '../../components/ImageUploader';
import { Spinner } from '../../components/Spinner';
import { ClipboardDocumentListIcon } from '../../components/icons/ClipboardDocumentListIcon';
import { CubeIcon } from '../../components/icons/CubeIcon';
import { DocumentTextIcon } from '../../components/icons/DocumentTextIcon';
import { UsersGroupIcon } from '../../components/icons/UsersGroupIcon';
import { PhotoIcon } from '../../components/icons/PhotoIcon';
import { XMarkIcon } from '../../components/icons/XMarkIcon';
import { CurrencyDollarIcon } from '../../components/icons/CurrencyDollarIcon';
import { PaperAirplaneIcon } from '../../components/icons/PaperAirplaneIcon';
import { BanknotesIcon } from '../../components/icons/BanknotesIcon';

interface ShopJobDetailsProps {
    job: Job;
    allStaff: StaffMember[];
    onBack: () => void;
    onSendMessage: (message: string) => void;
    onUpdateStatus: (status: Job['status']) => void;
    onUpdateClientDetails: (details: ClientDetails) => void;
    onUpdatePhotos: (category: 'damage' | 'inProgress' | 'completed', photos: string[]) => void;
    onUpdateStaff: (staff: StaffMember[]) => void;
    onUpdateParts: (parts: Part[]) => void;
    onUpdateNotes: (notes: string) => void;
    onProvideQuote: (quote: ManualQuote) => void;
    onGenerateInvoice: () => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (err) => reject(err);
});


const TabButton: React.FC<{ isActive: boolean; onClick: () => void; icon: React.FC<any>; label: string }> = ({ isActive, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isActive 
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' 
            : 'text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700/70 hover:text-slate-800 dark:hover:text-white'
        }`}
    >
        <Icon className="h-5 w-5" />
        <span className="hidden sm:inline">{label}</span>
    </button>
);

const QuoteCreator: React.FC<{ onSubmit: (quote: ManualQuote) => void }> = ({ onSubmit }) => {
    const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
    const [notes, setNotes] = useState('');

    const handleItemChange = (index: number, field: keyof typeof items[0], value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);
    const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));
    const total = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validItems = items.filter(item => item.description.trim() && item.price > 0 && item.quantity > 0);
        if (validItems.length === 0) return alert("Please add at least one valid line item with a price and quantity greater than 0.");
        onSubmit({ items: validItems, total, notes });
    };
    
    const inputClasses = "w-full p-2 bg-transparent border-0 focus:ring-2 focus:ring-violet-500 rounded-md text-slate-900 dark:text-white placeholder:text-slate-400";

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Create Manual Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-blue-600 text-white text-left">
                            <tr>
                                <th className="p-3 font-semibold">Description</th>
                                <th className="p-3 font-semibold text-center w-24">Qty</th>
                                <th className="p-3 font-semibold text-center w-32">Price ($)</th>
                                <th className="p-3 font-semibold text-center w-20">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0 odd:bg-white dark:odd:bg-slate-900/50 even:bg-blue-50 dark:even:bg-blue-950/20">
                                    <td className="p-0"><input type="text" placeholder="Item description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className={inputClasses} required /></td>
                                    <td className="p-0"><input type="number" placeholder="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 1)} className={`${inputClasses} text-center`} required min="1" /></td>
                                    <td className="p-0"><input type="number" placeholder="0.00" value={item.price} onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} className={`${inputClasses} text-center`} required min="0" step="0.01" /></td>
                                    <td className="p-1 text-center">
                                        <button type="button" onClick={() => removeItem(index)} disabled={items.length <= 1} className="text-red-500/70 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/10">
                                            <XMarkIcon className="h-4 w-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button type="button" onClick={addItem} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300">+ Add Line Item</button>
                <textarea placeholder="Notes for customer (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 h-20 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"></textarea>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-lg text-slate-900 dark:text-white">Total: {formatCurrency(total)}</p>
                    <button 
                        type="submit" 
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-2.5 sm:px-6 sm:py-2 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-md"
                        title="Send Quote"
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Send Quote</span>
                    </button>
                </div>
            </form>
        </div>
    );
};


export const ShopJobDetails: React.FC<ShopJobDetailsProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'parts' | 'notes'>('overview');
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    const handleScanLicense = async (file: File) => {
        setIsScanning(true);
        setScanError(null);
        try {
            const base64Image = await fileToBase64(file);
            const extractedData = await extractDetailsFromDriversLicense(base64Image);
            props.onUpdateClientDetails(extractedData);
        } catch (err) {
            setScanError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsScanning(false);
        }
    };
    
    const OverviewTab = () => (
         <div className="space-y-6">
            <CarDetailsForm 
                carDetails={props.job.carDetails}
                clientDetails={props.job.clientDetails}
                onCarChange={() => {}} // In this view, car details are read-only
                onClientChange={(field, value) => props.onUpdateClientDetails({ ...props.job.clientDetails!, [field]: value })}
                onScan={handleScanLicense}
                isScanning={isScanning}
            />
            {scanError && <p className="text-red-400 text-sm">Scan failed: {scanError}</p>}

             {props.job.status === 'New' && (
                <QuoteCreator onSubmit={props.onProvideQuote} />
             )}

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Assign Staff</h3>
                <div className="flex flex-wrap gap-2">
                    {props.allStaff.map(staff => {
                        const isAssigned = props.job.assignedStaff?.some(s => s.id === staff.id) ?? false;
                        return (
                             <button key={staff.id} 
                                onClick={() => {
                                    const currentAssigned = props.job.assignedStaff || [];
                                    const newAssigned = isAssigned ? currentAssigned.filter(s => s.id !== staff.id) : [...currentAssigned, staff];
                                    props.onUpdateStaff(newAssigned);
                                }}
                                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                                    isAssigned 
                                    ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/40' 
                                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500'
                                }`}
                             >
                                {staff.name} <span className="text-xs opacity-70">({staff.role})</span>
                            </button>
                        )
                    })}
                </div>
            </div>
             <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Update Job Status</h3>
                 {props.job.status === 'Final Check' ? (
                      <button 
                        onClick={props.onGenerateInvoice} 
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold p-2.5 sm:px-6 sm:py-2 rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all shadow-md"
                        title="Generate Invoice & Request Payment"
                      >
                        <BanknotesIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Generate Invoice & Request Payment</span>
                      </button>
                 ) : (
                    <div className="flex flex-wrap gap-2">
                         {(['In Repair', 'Painting', 'Final Check'] as const).map(status => (
                            <button key={status} onClick={() => props.onUpdateStatus(status)} 
                                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                    props.job.status === status 
                                    ? 'bg-violet-600 text-white' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                Mark as {status}
                            </button>
                         ))}
                    </div>
                 )}

             </div>
         </div>
    );
    
    const PhotosTab = () => {
        const handleImageUpload = (category: 'inProgress' | 'completed') => async (files: File[]) => {
            const base64Images = await Promise.all(files.map(fileToBase64));
            // In a real app, upload files to a server and get URLs. For demo, use base64 strings.
            const existingPhotos = props.job.photos[category] || [];
            props.onUpdatePhotos(category, [...existingPhotos, ...base64Images.map(b64 => `data:image/jpeg;base64,${b64}`)]);
        };
        
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">In-Progress Photos</h3>
                    <ImageUploader onImagesChange={handleImageUpload('inProgress')} imagePreviews={props.job.photos.inProgress || []} />
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Completed Work Photos</h3>
                    <ImageUploader onImagesChange={handleImageUpload('completed')} imagePreviews={props.job.photos.completed || []} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Customer's Damage Photos (View-Only)</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {props.job.photos.damage.map((src, index) => (
                           <a key={index} href={src} target="_blank" rel="noopener noreferrer">
                               <img src={src} alt={`damage ${index+1}`} className="w-full h-24 object-cover rounded-md transition-transform hover:scale-105" />
                            </a>
                       ))}
                    </div>
                </div>
            </div>
        )
    };
    
    const PartsTab = () => {
        const [newPartName, setNewPartName] = useState('');
        const parts = props.job.parts || [];

        const addPart = () => {
            if (!newPartName.trim()) return;
            const newPart: Part = { id: `part-${Date.now()}`, name: newPartName, supplier: 'TBD', price: 0, status: 'Needed' };
            props.onUpdateParts([...parts, newPart]);
            setNewPartName('');
        }
        
        const updatePartStatus = (partId: string, status: Part['status']) => {
            const newParts = parts.map(p => p.id === partId ? {...p, status} : p);
            props.onUpdateParts(newParts);
        }
        
        const removePart = (partId: string) => {
            props.onUpdateParts(parts.filter(p => p.id !== partId));
        }

        return (
            <div className="space-y-4">
                 <div className="flex gap-2">
                    <input type="text" value={newPartName} onChange={e => setNewPartName(e.target.value)} placeholder="Enter new part name..." className="flex-grow p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                    <button onClick={addPart} className="bg-violet-600 text-white font-semibold px-4 py-2 rounded-lg">Add Part</button>
                 </div>
                 <div className="space-y-2">
                    {parts.map(part => (
                        <div key={part.id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="flex-grow text-slate-800 dark:text-slate-300">{part.name}</span>
                            <select value={part.status} onChange={e => updatePartStatus(part.id, e.target.value as Part['status'])} className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white text-xs p-1">
                                <option>Needed</option>
                                <option>Ordered</option>
                                <option>Received</option>
                            </select>
                            <button onClick={() => removePart(part.id)} className="text-red-500 hover:text-red-400">&times;</button>
                        </div>
                    ))}
                 </div>
            </div>
        )
    }
    
    const NotesTab = () => (
        <div>
            <textarea
                value={props.job.notes || ''}
                onChange={(e) => props.onUpdateNotes(e.target.value)}
                placeholder="Add internal notes for technicians here..."
                className="w-full p-3 h-48 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition mb-4 text-slate-900 dark:text-white"
            ></textarea>
        </div>
    );
    

    return (
        <div className="animate-in fade-in duration-300">
             <button onClick={props.onBack} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors mb-4">
                &larr; Back to all jobs
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Job</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Job ID: {props.job.id} | Status: <span className="font-semibold text-slate-700 dark:text-slate-300">{props.job.status}</span></p>
            
            {props.job.status !== 'New' && props.job.status !== 'Quote Provided' && props.job.status !== 'Estimate' && props.job.status !== 'Cancelled' && (
                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/50 mb-6 card-interactive">
                    <JobStatusTracker currentStatus={props.job.status} />
                </div>
            )}

            <div className="my-6">
                <div className="flex flex-wrap items-center gap-2">
                    <TabButton isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={UsersGroupIcon} label="Overview" />
                    <TabButton isActive={activeTab === 'photos'} onClick={() => setActiveTab('photos')} icon={PhotoIcon} label="Photos" />
                    <TabButton isActive={activeTab === 'parts'} onClick={() => setActiveTab('parts')} icon={CubeIcon} label="Parts" />
                    <TabButton isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={DocumentTextIcon} label="Notes" />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                <div className="lg:col-span-2 space-y-8">
                   {activeTab === 'overview' && <OverviewTab />}
                   {activeTab === 'photos' && <PhotosTab />}
                   {activeTab === 'parts' && <PartsTab />}
                   {activeTab === 'notes' && <NotesTab />}
                </div>
                <div className="space-y-6">
                   <ChatInterface messages={props.job.chatHistory} onSendMessage={props.onSendMessage} currentUserSender="shop" />
                </div>
            </div>
        </div>
    );
};