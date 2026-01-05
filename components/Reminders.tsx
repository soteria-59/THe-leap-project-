
import React, { useState } from 'react';
import { Participant, ReminderLog, ScheduledReminder } from '../types';
import { Send, Clock, Users, AlertTriangle, CheckCircle2, MessageSquare, XCircle, Plus, Edit2, Trash2, Calendar, MoreVertical, PlayCircle, PauseCircle, X } from 'lucide-react';
import { MOCK_REMINDERS, MOCK_SCHEDULED_REMINDERS } from '../services/mockData';

interface RemindersProps {
  participants: Participant[];
  onAction: (message: string, type: 'success' | 'info' | 'error') => void;
  onOpenEmail: (recipients: Participant[]) => void;
  onOpenWhatsApp: (recipients: Participant[]) => void;
}

// Internal Modal Component for Scheduled Reminders
const ScheduledReminderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  reminder?: ScheduledReminder | null;
  onSave: (r: Omit<ScheduledReminder, 'id' | 'status' | 'nextRun'>) => void;
}> = ({ isOpen, onClose, reminder, onSave }) => {
  const [title, setTitle] = useState(reminder?.title || '');
  const [type, setType] = useState<'One-time' | 'Recurring'>(reminder?.type || 'One-time');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>(reminder?.frequency || 'Weekly');
  const [dayOfWeek, setDayOfWeek] = useState(reminder?.dayOfWeek || 'Monday');
  const [time, setTime] = useState(reminder?.time || '09:00');
  const [targetDate, setTargetDate] = useState(reminder?.targetDate || '');
  const [audience, setAudience] = useState<ScheduledReminder['audience']>(reminder?.audience || 'All');
  const [messageBody, setMessageBody] = useState(reminder?.messageBody || '');

  React.useEffect(() => {
    if (isOpen) {
      if (reminder) {
        setTitle(reminder.title);
        setType(reminder.type);
        setFrequency(reminder.frequency || 'Weekly');
        setDayOfWeek(reminder.dayOfWeek || 'Monday');
        setTime(reminder.time);
        setTargetDate(reminder.targetDate || '');
        setAudience(reminder.audience);
        setMessageBody(reminder.messageBody);
      } else {
        // Reset defaults
        setTitle('');
        setType('One-time');
        setFrequency('Weekly');
        setDayOfWeek('Monday');
        setTime('09:00');
        setTargetDate('');
        setAudience('All');
        setMessageBody('');
      }
    }
  }, [isOpen, reminder]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      type,
      frequency: type === 'Recurring' ? frequency : undefined,
      dayOfWeek: type === 'Recurring' ? dayOfWeek : undefined,
      time,
      targetDate: type === 'One-time' ? targetDate : undefined,
      audience,
      messageBody
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{reminder ? 'Edit Reminder' : 'Create Schedule'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input 
              required
              className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Weekly Content Drop"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select 
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
                value={type}
                onChange={e => setType(e.target.value as any)}
              >
                <option value="One-time">One-time</option>
                <option value="Recurring">Recurring</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
              <input 
                type="time"
                required
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>

          {type === 'Recurring' ? (
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
                  <select 
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as any)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Day</label>
                  <select 
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
                    value={dayOfWeek}
                    onChange={e => setDayOfWeek(e.target.value)}
                    disabled={frequency === 'Daily'}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
               </div>
             </div>
          ) : (
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
               <input 
                type="date"
                required
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
              />
            </div>
          )}

          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Audience</label>
             <select 
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
                value={audience}
                onChange={e => setAudience(e.target.value as any)}
              >
                <option value="All">All Participants</option>
                <option value="Low Engagement">Low Engagement Only</option>
                <option value="Medium Engagement">Medium Engagement Only</option>
                <option value="High Engagement">High Engagement Only</option>
              </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message Content</label>
            <textarea 
              rows={3}
              className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white resize-none"
              value={messageBody}
              onChange={e => setMessageBody(e.target.value)}
              placeholder="Hello {name}..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
             <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
             <button type="submit" className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Internal Modal for Watchlist
const WatchlistModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onMessage: (p: Participant) => void;
}> = ({ isOpen, onClose, participants, onMessage }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold">At Risk Watchlist ({participants.length})</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="overflow-y-auto custom-scrollbar p-2 flex-1 space-y-2">
           {participants.map(p => (
             <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                       {p.fullName.charAt(0)}
                    </div>
                    <div>
                       <p className="text-sm font-medium text-slate-900 dark:text-white">{p.fullName}</p>
                       <p className="text-xs text-slate-500">{p.whatsapp}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => onMessage(p)}
                   className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                   title="Message via WhatsApp"
                 >
                    <MessageSquare className="w-4 h-4" />
                 </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};


const Reminders: React.FC<RemindersProps> = ({ participants, onAction, onOpenEmail, onOpenWhatsApp }) => {
  // Accountability Logic: Filter participants with low accountability checkins
  const accountabilityRisk = participants.filter(p => p.accountabilityCheckins < 4); // Mock threshold

  // State for Scheduled Reminders
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>(MOCK_SCHEDULED_REMINDERS);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ScheduledReminder | null>(null);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);

  const getStatusColor = (status: string, rate: number) => {
    if (status === 'Failed') return 'bg-red-500';
    if (status === 'Scheduled') return 'bg-slate-400';
    if (rate === 100) return 'bg-green-500';
    if (rate >= 90) return 'bg-emerald-500';
    return 'bg-amber-500';
  };

  const handleEditClick = (reminder: ScheduledReminder) => {
    setEditingReminder(reminder);
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingReminder(null);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setScheduledReminders(prev => prev.filter(r => r.id !== id));
      onAction("Schedule deleted", "info");
    }
  };

  const handleToggleStatus = (id: string) => {
    setScheduledReminders(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' } : r
    ));
    onAction("Schedule status updated", "success");
  };

  const handleSaveReminder = (data: Omit<ScheduledReminder, 'id' | 'status' | 'nextRun'>) => {
    if (editingReminder) {
      // Update existing
      setScheduledReminders(prev => prev.map(r => 
        r.id === editingReminder.id 
        ? { ...r, ...data, nextRun: 'Recalculating...' } // Mock update nextRun
        : r
      ));
      onAction("Reminder schedule updated", "success");
    } else {
      // Create new
      const newReminder: ScheduledReminder = {
        id: `sr-${Date.now()}`,
        status: 'Active',
        nextRun: 'Pending...',
        ...data
      };
      setScheduledReminders(prev => [...prev, newReminder]);
      onAction("New schedule created", "success");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reminders</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage automated communications.</p>
        </div>
        <button 
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Schedule
        </button>
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
               <button 
                onClick={() => setIsWatchlistModalOpen(true)}
                className="w-full py-2 mt-1 text-xs text-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
               >
                 View +{accountabilityRisk.length - 5} more at risk
               </button>
             )}
           </div>
        </div>
      </div>

      {/* Active Schedules Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Active Schedules
            </h3>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                   <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                   <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Frequency</th>
                   <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Next Run</th>
                   <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Audience</th>
                   <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {scheduledReminders.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{r.title}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                       {r.type === 'Recurring' ? (
                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.frequency} ({r.dayOfWeek} {r.time})</span>
                       ) : (
                         <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> One-time ({r.targetDate} {r.time})</span>
                       )}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{r.nextRun}</td>
                    <td className="p-4">
                       <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded text-slate-600 dark:text-slate-300">{r.audience}</span>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleToggleStatus(r.id)} title={r.status === 'Active' ? 'Pause' : 'Resume'}>
                             {r.status === 'Active' ? <PauseCircle className="w-5 h-5 text-green-500" /> : <PlayCircle className="w-5 h-5 text-slate-400" />}
                          </button>
                          <button onClick={() => handleEditClick(r)} className="p-1 text-slate-500 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(r.id)} className="p-1 text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </td>
                  </tr>
                ))}
                {scheduledReminders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No active schedules. Click "New Schedule" to create one.</td>
                  </tr>
                )}
              </tbody>
           </table>
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
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase w-48">Delivery Status</th>
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
                          <td className="p-4 align-middle">
                            <div className="w-full max-w-[180px]">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        {log.status === 'Sent' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                                        {log.status === 'Scheduled' && <Clock className="w-3.5 h-3.5 text-slate-400" />}
                                        {log.status === 'Failed' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                        <span className={`text-xs font-medium ${
                                            log.status === 'Sent' ? 'text-slate-700 dark:text-slate-200' : 
                                            log.status === 'Failed' ? 'text-red-600' : 'text-slate-500'
                                        }`}>
                                            {log.status}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        {log.status === 'Scheduled' ? '-' : `${log.deliveryRate}%`}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${getStatusColor(log.status, log.deliveryRate)}`}
                                        style={{ width: log.status === 'Scheduled' ? '0%' : `${log.deliveryRate}%` }}
                                    ></div>
                                </div>
                            </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      </div>

      <ScheduledReminderModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        reminder={editingReminder}
        onSave={handleSaveReminder}
      />

      <WatchlistModal 
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        participants={accountabilityRisk}
        onMessage={(p) => {
            setIsWatchlistModalOpen(false);
            onOpenWhatsApp([p]);
        }}
      />
    </div>
  );
};

export default Reminders;
