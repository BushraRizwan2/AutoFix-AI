
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';

interface ChatInterfaceProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    currentUserSender: 'customer' | 'shop' | 'admin';
}

const MessageBubble: React.FC<{ message: ChatMessage; currentUserSender: ChatMessage['sender'] }> = ({ message, currentUserSender }) => {
    const isUser = message.sender === currentUserSender;
    const isSystem = message.sender === 'system';
    
    if (isSystem) {
        return (
             <div className="text-center my-4">
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">{message.text} - {new Date(message.timestamp).toLocaleDateString()}</p>
             </div>
        )
    }

    const getSenderIcon = () => {
        switch(message.sender) {
            case 'shop': return <BuildingStorefrontIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />;
            case 'admin': return <Cog6ToothIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />;
            case 'customer': return <UserCircleIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />;
            default: return <UserCircleIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />;
        }
    };
    
    return (
        <div className={`flex items-end gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {getSenderIcon()}
                </div>
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-md ${isUser 
                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-lg' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'
            }`}>
                <p className="text-sm break-words">{message.text}</p>
                <p className={`text-xs mt-1 text-right ${isUser ? 'text-violet-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            {isUser && (
                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {getSenderIcon()}
                </div>
            )}
        </div>
    )
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, currentUserSender }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newMessage.trim()){
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col h-96">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
                <h3 className="font-semibold text-slate-900 dark:text-white">Live Chat</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} currentUserSender={currentUserSender} />)}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/50">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full p-2 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition text-slate-900 dark:text-white"
                    />
                    <button type="submit" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3 rounded-full hover:from-violet-500 hover:to-indigo-500 transition-all flex-shrink-0 shadow-lg">
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
