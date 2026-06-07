
import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Notification } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { BellAlertIcon } from './icons/BellAlertIcon';

const ToastMessage: React.FC<{ notification: Notification, onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 flex items-start gap-4 w-full max-w-sm border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex-shrink-0 text-violet-500 dark:text-violet-400 mt-1">
        <BellAlertIcon className="h-6 w-6" />
      </div>
      <div className="flex-grow text-sm">
        <p className="font-semibold text-slate-800 dark:text-white">New Notification</p>
        <p className="text-slate-600 dark:text-slate-400">{notification.message}</p>
      </div>
      <button onClick={() => onDismiss(notification.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { notifications } = useNotifications();
  const [toasts, setToasts] = useState<Notification[]>([]);
  const shownToastsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only add unread notifications that haven't been shown in this session yet
    const newUnread = notifications.filter(n => !n.read && !shownToastsRef.current.has(n.id) && !toasts.some(t => t.id === n.id));
    if (newUnread.length > 0) {
        const nextToast = newUnread[0];
        shownToastsRef.current.add(nextToast.id);
        
        // We only show the latest unread notification as a toast to avoid spamming
        setToasts(prev => {
            if (prev.some(t => t.id === nextToast.id)) {
                return prev;
            }
            return [...prev, nextToast];
        });
    }
  }, [notifications]);

  const handleDismiss = (id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-4">
      {toasts.map(notification => (
        <ToastMessage key={notification.id} notification={notification} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};
