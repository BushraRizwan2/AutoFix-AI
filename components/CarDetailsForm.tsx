
import React, { useRef } from 'react';
import { CarDetails, ClientDetails } from '../types';
import { CarIcon } from './icons/CarIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { IdentificationIcon } from './icons/IdentificationIcon';
import { ClipboardDocumentIcon } from './icons/ClipboardDocumentIcon';
import { LicensePlateIcon } from './icons/LicensePlateIcon';
import { Spinner } from './Spinner';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { MapPinIcon } from './icons/MapPinIcon';


interface CarDetailsFormProps {
    carDetails: CarDetails;
    clientDetails?: ClientDetails;
    onCarChange: (field: keyof CarDetails, value: string) => void;
    onClientChange?: (field: keyof ClientDetails, value: string) => void;
    onScan: (file: File) => void;
    isScanning: boolean;
}

const FormInput: React.FC<{
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    icon: React.ReactNode;
    maxLength?: number;
}> = ({ id, label, placeholder, value, onChange, icon, maxLength }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {label}
        </label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </div>
            <input
                type="text" id={id} value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full pl-10 p-3 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
        </div>
    </div>
);


export const CarDetailsForm: React.FC<CarDetailsFormProps> = ({ carDetails, clientDetails, onCarChange, onClientChange, onScan, isScanning }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onScan(event.target.files[0]);
      event.target.value = ''; // Allow re-uploading the same file
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Client & Vehicle Details
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Fill manually or scan a driver's license to auto-populate.</p>
            </div>
            <div className="flex-shrink-0">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                />
                <button
                    onClick={handleScanClick}
                    disabled={isScanning}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg px-4 py-2 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                    {isScanning ? (
                        <>
                            <Spinner className="h-5 w-5" />
                            <span>Scanning...</span>
                        </>
                    ) : (
                        <>
                            <ClipboardDocumentIcon className="h-5 w-5" />
                            <span>Scan Driver's License</span>
                        </>
                    )}
                </button>
            </div>
        </div>

        {clientDetails && onClientChange && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <h4 className="md:col-span-2 text-md font-semibold text-violet-600 dark:text-violet-400 -mb-2">Client Info</h4>
                <FormInput
                    id="clientName"
                    label="Client Name"
                    placeholder="e.g., John Doe"
                    value={clientDetails.name}
                    onChange={(val) => onClientChange('name', val)}
                    icon={<UserCircleIcon className="h-5 w-5 text-slate-400" />}
                />
                 <FormInput
                    id="clientAddress"
                    label="Client Address"
                    placeholder="e.g., 123 Main St, Anytown"
                    value={clientDetails.address}
                    onChange={(val) => onClientChange('address', val)}
                    icon={<MapPinIcon className="h-5 w-5 text-slate-400" />}
                />
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <h4 className="md:col-span-2 text-md font-semibold text-violet-600 dark:text-violet-400 -mb-2">Vehicle Info</h4>
             <FormInput 
                id="registrationNo"
                label="Registration No."
                placeholder="e.g., ABC-123"
                value={carDetails.registrationNo}
                onChange={(val) => onCarChange('registrationNo', val)}
                icon={<LicensePlateIcon className="h-5 w-5 text-slate-400" />}
            />
             <FormInput 
                id="make"
                label="Make"
                placeholder="e.g., Toyota"
                value={carDetails.make}
                onChange={(val) => onCarChange('make', val)}
                icon={<CarIcon className="h-5 w-5 text-slate-400" />}
            />
             <FormInput 
                id="model"
                label="Model"
                placeholder="e.g., Camry"
                value={carDetails.model}
                onChange={(val) => onCarChange('model', val)}
                icon={<CarIcon className="h-5 w-5 text-slate-400" />}
            />
             <FormInput 
                id="year"
                label="Year"
                placeholder="e.g., 2022"
                value={carDetails.year}
                onChange={(val) => onCarChange('year', val)}
                icon={<CalendarDaysIcon className="h-5 w-5 text-slate-400" />}
                maxLength={4}
            />
            <FormInput 
                id="vin"
                label="VIN (Optional)"
                placeholder="17-digit VIN"
                value={carDetails.vin}
                onChange={(val) => onCarChange('vin', val)}
                icon={<IdentificationIcon className="h-5 w-5 text-slate-400" />}
                maxLength={17}
            />
        </div>
    </div>
  );
};
