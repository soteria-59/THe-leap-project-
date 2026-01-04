
import React, { useState } from 'react';
import { Save, Calendar, MessageSquare, Sliders, CheckCircle2, AlertCircle, FileText, Activity } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface SettingsProps {
  onAction: (message: string, type: 'success' | 'info' | 'error') => void;
  auditLogs: AuditLogEntry[];
}

const Settings: React.FC<SettingsProps> = ({ onAction, auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'audit'>('config');
  const [isSaved, setIsSaved] = useState(false);
  
  // Mock State for Settings
  const [config, setConfig] = useState({
    schedule: {
      contentReleaseDay: 'Monday',
      contentReleaseTime: '09:00',
      nudgeDay: 'Thursday',
      nudgeTime: '14:00',
    },
    thresholds: {
      passingGrade: 80,
      lowEngagementWarning: 50,
      autoFlagMissedWeeks: 2,
    },
    templates: {
      weeklyRelease: "Hi {name}! 🚀 Week {week} content is now live in Google Classroom. This week we focus on {topic}. Let's go! - Leap Team",
      accountabilityNudge: "Hi {name}, we noticed you haven't checked in for Week {week} yet. Remember, consistency is key! needed help? Reply here.",
      graduationCongrat: "Congratulations {name}! 🎉 You have officially completed the Leap Leadership Program. Your certificate is attached."
    }
  });

  const handleSave = () => {
    // In a real app, this would push to an API
    setIsSaved(true);
    onAction('System settings updated successfully.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 pb-8 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure automation rules and view audit logs.</p>
        </div>
        {activeTab === 'config' && (
            <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSaved 
                ? 'bg-green-500 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
            }`}
            >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Changes Saved' : 'Save Changes'}
            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'config' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Configuration
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'audit' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Audit Trail
          </button>
      </div>

      {activeTab === 'config' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pb-10">
            {/* Column 1: Thresholds & Schedule */}
            <div className="space-y-6">
            
            {/* Completion Thresholds */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                    <Sliders className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Completion Logic & Thresholds</h3>
                </div>
                <div className="p-6 space-y-6">
                
                <div>
                    <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Minimum Completion Rate (Graduation)</label>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{config.thresholds.passingGrade}%</span>
                    </div>
                    <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    value={config.thresholds.passingGrade}
                    onChange={(e) => setConfig({...config, thresholds: {...config.thresholds, passingGrade: parseInt(e.target.value)}})}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-xs text-slate-500 mt-1">Participants below this % at Week 12 will not receive certificates.</p>
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Low Engagement Warning Threshold</label>
                    <span className="text-sm font-bold text-amber-600">{config.thresholds.lowEngagementWarning}%</span>
                    </div>
                    <input 
                    type="range" 
                    min="0" 
                    max="80" 
                    value={config.thresholds.lowEngagementWarning}
                    onChange={(e) => setConfig({...config, thresholds: {...config.thresholds, lowEngagementWarning: parseInt(e.target.value)}})}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Dashboard flags participants dropping below this rate.</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto-flag after consecutive missed weeks</label>
                    <select 
                    value={config.thresholds.autoFlagMissedWeeks}
                    onChange={(e) => setConfig({...config, thresholds: {...config.thresholds, autoFlagMissedWeeks: parseInt(e.target.value)}})}
                    className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                    >
                    <option value="1">1 Week</option>
                    <option value="2">2 Weeks</option>
                    <option value="3">3 Weeks</option>
                    </select>
                </div>
                </div>
            </div>

            {/* Automation Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                    <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Weekly Schedule</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Content Release</label>
                    <div className="flex gap-2">
                        <select 
                        value={config.schedule.contentReleaseDay}
                        onChange={(e) => setConfig({...config, schedule: {...config.schedule, contentReleaseDay: e.target.value}})}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg p-2.5 outline-none"
                        >
                        {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input 
                        type="time" 
                        value={config.schedule.contentReleaseTime}
                        onChange={(e) => setConfig({...config, schedule: {...config.schedule, contentReleaseTime: e.target.value}})}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg p-2.5 outline-none"
                        />
                    </div>
                    <p className="text-xs text-slate-500">Triggers "Weekly Release" template.</p>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Engagement Nudge</label>
                    <div className="flex gap-2">
                        <select 
                        value={config.schedule.nudgeDay}
                        onChange={(e) => setConfig({...config, schedule: {...config.schedule, nudgeDay: e.target.value}})}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg p-2.5 outline-none"
                        >
                        {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input 
                        type="time" 
                        value={config.schedule.nudgeTime}
                        onChange={(e) => setConfig({...config, schedule: {...config.schedule, nudgeTime: e.target.value}})}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg p-2.5 outline-none"
                        />
                    </div>
                    <p className="text-xs text-slate-500">Only sent to at-risk participants.</p>
                </div>
                </div>
            </div>
            </div>

            {/* Column 2: Templates */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">WhatsApp Templates</h3>
                </div>
                
                <div className="p-6 space-y-6 flex-1">
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        Use <code className="bg-white dark:bg-slate-800 px-1 rounded font-bold">{'{name}'}</code> and <code className="bg-white dark:bg-slate-800 px-1 rounded font-bold">{'{week}'}</code> as variables.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Weekly Release Message</label>
                    <textarea 
                        rows={4}
                        value={config.templates.weeklyRelease}
                        onChange={(e) => setConfig({...config, templates: {...config.templates, weeklyRelease: e.target.value}})}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Accountability Nudge (At-Risk)</label>
                    <textarea 
                        rows={4}
                        value={config.templates.accountabilityNudge}
                        onChange={(e) => setConfig({...config, templates: {...config.templates, accountabilityNudge: e.target.value}})}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Graduation Success Message</label>
                    <textarea 
                        rows={3}
                        value={config.templates.graduationCongrat}
                        onChange={(e) => setConfig({...config, templates: {...config.templates, graduationCongrat: e.target.value}})}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />
                </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">System Audit Log</h3>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Actor</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Details</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {auditLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                                <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{log.actorName}</td>
                                <td className="p-4 text-xs font-mono text-indigo-600 dark:text-indigo-400">{log.action}</td>
                                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{log.details}</td>
                                <td className="p-4 text-right">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${log.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800'}`}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
