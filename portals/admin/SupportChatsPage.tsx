
import React from 'react';
import { ChatInterface } from '../../components/ChatInterface';
import { SupportTicket } from '../../types';
import { TicketIcon } from '../../components/icons/TicketIcon';

interface SupportChatsPageProps {
    tickets: SupportTicket[];
    selectedTicket: SupportTicket | null;
    onSelectTicket: (ticket: SupportTicket) => void;
    onSendMessage: (messageText: string) => void;
    onBack: () => void;
}

const TicketStatusBadge: React.FC<{status: SupportTicket['status']}> = ({status}) => {
    const styles = {
        Open: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        'In Progress': 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
        Closed: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}>{status}</span>
}


export const SupportChatsPage: React.FC<SupportChatsPageProps> = ({ tickets, selectedTicket, onSelectTicket, onSendMessage, onBack }) => {

    if (selectedTicket) {
        return (
            <div className="animate-in fade-in duration-300">
                 <button onClick={onBack} className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors mb-4">
                    &larr; Back to all tickets
                </button>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Support Ticket #{selectedTicket.id.slice(-4)}</h1>
                        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                            Conversation with <span className="font-semibold text-violet-600 dark:text-violet-400">{selectedTicket.customerEmail}</span>
                        </p>
                    </div>
                </div>
                <ChatInterface messages={selectedTicket.chatHistory} onSendMessage={onSendMessage} currentUserSender="admin" />
            </div>
        )
    }

    return (
        <div className="animate-in fade-in duration-300">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Support Center</h1>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        Manage customer support tickets.
                    </p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-4">
                {tickets.map(ticket => (
                    <div 
                        key={ticket.id}
                        onClick={() => onSelectTicket(ticket)}
                        className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-violet-400 dark:hover:border-violet-500/50 cursor-pointer transition-all"
                    >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div className="flex items-center gap-3">
                                <TicketIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">{ticket.subject}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">From: {ticket.customerEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <p className="text-xs text-slate-500 dark:text-slate-500">Last updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</p>
                               <TicketStatusBadge status={ticket.status} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
