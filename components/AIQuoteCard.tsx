
import React from 'react';
import { AIAnalysisResult } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';

interface AIQuoteCardProps {
  analysis: AIAnalysisResult;
}

export const AIQuoteCard: React.FC<AIQuoteCardProps> = ({ analysis }) => {
  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl p-6 border border-slate-200 dark:border-slate-700/50 card-interactive">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI-Powered Estimate</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">Damage Type</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1">{analysis.damageType}</p>
            </div>
             <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">Est. Cost</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1">{analysis.estimatedCost}</p>
            </div>
             <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">Est. Time</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1">{analysis.estimatedTime}</p>
            </div>
        </div>
        <div className="mt-4 text-right">
             <span className="text-xs font-medium text-cyan-700 bg-cyan-100/50 dark:text-cyan-400 dark:bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-200 dark:border-cyan-500/20">
                Confidence: {analysis.confidence}%
             </span>
        </div>
    </div>
  );
};
