
import React from 'react';
import { Participant, ReminderLog } from '../types';
import { Send, Clock, Users, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { MOCK_REMINDERS } from '../services/mockData';

interface RemindersProps {
  participants: Participant[];
  onAction: (message: string, type: 'success' | 'info' | 'error') => void;
  onOpenEmail: (recipients: Participant[]) => void;
  onOpenWhatsApp: (recipients: Participant[]) => void;
}

const Reminders: React.FC<RemindersProps> = ({ participants, onAction, onOpenEmail, onOpenWhatsApp }) => {
  // Accountability Logic: Filter participants with low accountability checkins
  // In a real app, this would check against expected number of checkins for the current week
  const accountabilityRisk = participants.filter(p => p.accountabilityCheckins < 4); // Mock threshold

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reminders</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage automated communications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Communication</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onOpenEmail(participants)}
              className="flex flex-col items-start p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-left w-full h-full"
            >
               <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg mb-3 text-indigo-600 dark:text-indigo-300">
                  <Send className="w-5 h-5" />
               </div>
               <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Release Content</span>
               <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">Triggers Monday template to all active</span>
            </button>
            <button 
              onClick={() => onOpenWhatsApp(accountabilityRisk)}
              className="flex flex-col items-start p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-left w-full h-full"
            >
               <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-lg mb-3 text-amber-600 dark:text-amber-300">
                  <AlertTriangle className="w-5 h-5" />
               </div>
               <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Nudge Risk</span>
               <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">Sends reminder to {accountabilityRisk.length} flagged students</span>
            </button>
          </div>
        </div>

        {/* Accountability Watchlist Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
           <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
             <Users className="w-5 h-5 text-red-500" />
             Watchlist
           </h2>
           <div className="flex-1 overflow-y-auto custom-scrollbar max-h-60 space-y-3">
             {accountabilityRisk.slice(0, 5).map(p => (
               <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                       {p.fullName.charAt(0)}
                    </div>
                    <div>
                       <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[100px]">{p.fullName}</p>
                       <p className="text-xs text-red-500">Missed check-in</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => onOpenWhatsApp([p])}
                   className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 p-1 rounded"
                 >
                    <MessageSquare className="w-4 h-4" />
                 </button>
               </div>
             ))}
             {accountabilityRisk.length > 5 && (
               <p className="text-xs text-center text-slate-500 pt-2">+{accountabilityRisk.length - 5} more at risk</p>
             )}
           </div>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent Communication Log
            </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date Sent</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Template / Action</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Recipients</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {MOCK_REMINDERS.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{log.date}</td>
                          <td className="p-4 font-medium text-slate-900 dark:text-white">{log.template}</td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                              {log.recipientCount}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                                {log.status === 'Sent' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                <span className={`text-sm ${log.status === 'Sent' ? 'text-green-600' : 'text-slate-500'}`}>
                                  {log.status} ({log.deliveryRate}%)
                                </span>
                            </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
