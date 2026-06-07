
import React from 'react';
import { AppSettings } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ComputerDesktopIcon } from './icons/ComputerDesktopIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

const SettingButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg border-2 transition-all ${
            isActive
                ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                : 'border-slate-300 dark:border-slate-700 bg-transparent hover:border-violet-400'
        }`}
    >
        {children}
    </button>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-sm m-4 p-8 border border-slate-200 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
            <h2 id="settings-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
                App Settings
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Customize your experience.</p>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                    <SettingButton onClick={() => onUpdateSettings({ theme: 'light' })} isActive={settings.theme === 'light'}>
                        <SunIcon className="w-5 h-5"/>
                        <span>Light</span>
                    </SettingButton>
                     <SettingButton onClick={() => onUpdateSettings({ theme: 'dark' })} isActive={settings.theme === 'dark'}>
                        <MoonIcon className="w-5 h-5"/>
                        <span>Dark</span>
                    </SettingButton>
                     <SettingButton onClick={() => onUpdateSettings({ theme: 'system' })} isActive={settings.theme === 'system'}>
                        <ComputerDesktopIcon className="w-5 h-5"/>
                        <span>System</span>
                    </SettingButton>
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Font Size</h3>
                <div className="grid grid-cols-3 gap-3">
                    <SettingButton onClick={() => onUpdateSettings({ fontSize: 'sm' })} isActive={settings.fontSize === 'sm'}>
                        Small
                    </SettingButton>
                     <SettingButton onClick={() => onUpdateSettings({ fontSize: 'md' })} isActive={settings.fontSize === 'md'}>
                        Medium
                    </SettingButton>
                     <SettingButton onClick={() => onUpdateSettings({ fontSize: 'lg' })} isActive={settings.fontSize === 'lg'}>
                        Large
                    </SettingButton>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
