
import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { BellIcon } from '../../components/icons/BellIcon';

interface NotificationsPageProps {
  onSelectJob: (jobId: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onSelectJob }) => {
  const { notifications, markAllAsRead, unreadCount } = useNotifications();

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

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Updates on your jobs and other important alerts.
          </p>
        </div>
        {unreadCount > 0 && (
            <button
                onClick={markAllAsRead}
                className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300"
            >
                Mark all as read
            </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50">
        {notifications.length > 0 ? (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {notifications.map(n => (
              <li
                key={n.id}
                className={`p-4 flex items-start gap-4 transition-colors ${!n.read ? 'bg-violet-50 dark:bg-violet-900/10' : ''}`}
              >
                <div className={`mt-1 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${!n.read ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <BellIcon className={`h-5 w-5 ${!n.read ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'}`} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{n.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeSince(n.timestamp)}</p>
                </div>
                {n.jobId && (
                  <button
                    onClick={() => onSelectJob(n.jobId!)}
                    className="flex-shrink-0 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    View Job
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-12">
            <BellIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">No Notifications Yet</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Important updates will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
