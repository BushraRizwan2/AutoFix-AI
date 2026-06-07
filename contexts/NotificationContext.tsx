
import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'notif-1', type: 'status_update', message: 'Your estimation request for Toyota Camry bumper correction has been approved.', jobId: 'JOB-MOCK001', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: 'notif-2', type: 'feedback', message: 'A new estimate chat reply has been received from Pro Paint & Body.', jobId: 'JOB-9876', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false },
    { id: 'notif-3', type: 'status_update', message: 'Status changed to "Painting" for your Honda Accord refinishing.', jobId: 'JOB-MOCK002', timestamp: new Date(Date.now() - 14400000).toISOString(), read: false },
    { id: 'notif-4', type: 'general', message: 'Invoice INV-001 has been posted for your recent service. Please view and settle.', jobId: 'JOB-9876', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
    { id: 'notif-5', type: 'status_update', message: 'The replacement side mirror unit has arrived in our inventory.', jobId: 'JOB-9876', timestamp: new Date(Date.now() - 172800000).toISOString(), read: true },
    { id: 'notif-6', type: 'status_update', message: 'Job status changed to "In Repair" at Collision Experts Inc.', jobId: 'JOB-MOCK003', timestamp: new Date(Date.now() - 259200000).toISOString(), read: true },
    { id: 'notif-7', type: 'general', message: 'Welcome to AutoFix AI! Start by uploading images to get a quick AI-powered bumper scratch estimate.', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), read: true },
    { id: 'notif-8', type: 'feedback', message: 'Estimate completed! AI Confidence level was measured at 96.8%.', jobId: 'JOB-ESTIMATE', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), read: true },
    { id: 'notif-9', type: 'status_update', message: 'Your booking has been scheduled for frame straightener booking on Thursday.', jobId: 'JOB-BCONF', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), read: true },
    { id: 'notif-10', type: 'status_update', message: 'Quality control inspector assigned to your Tesla paint restoration.', jobId: 'JOB-5555', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), read: true },
    { id: 'notif-11', type: 'feedback', message: 'Thanks for submitting your five-star review! It has been posted on the Pro Paint listing.', jobId: 'JOB-1234', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), read: true },
    { id: 'notif-12', type: 'status_update', message: 'Body panel pre-sanding phase has successfully passed technician checklist.', jobId: 'JOB-PAINT', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), read: false }
  ]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
