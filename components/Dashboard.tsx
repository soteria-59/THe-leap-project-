
import React from 'react';
import { Users, AlertTriangle, CheckCircle, Clock, Award, BookOpen } from 'lucide-react';
import { DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  onNavigate: (view: string, filter?: string) => void;
}

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon: React.ReactNode; 
  colorClass: string;
  onClick: () => void;
}> = ({ title, value, subtitle, icon, colorClass, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 group"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</h3>
        {subtitle && <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Program Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, Super Admin.</p>
        </div>
        <div className="flex space-x-3">
           <button 
             onClick={() => onNavigate('progress')}
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
             View Master Tracker
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Participants" 
          value={stats.totalParticipants} 
          subtitle={`${stats.activeParticipants} active students`}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          colorClass="bg-blue-500 text-blue-600"
          onClick={() => onNavigate('participants', 'All')}
        />
        <StatCard 
          title="Avg. Completion" 
          value={`${stats.avgCompletionRate}%`}
          subtitle="Assignments & Journals"
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          colorClass="bg-green-500 text-green-600"
          onClick={() => onNavigate('progress')}
        />
        <StatCard 
          title="Attention Needed" 
          value={stats.flaggedCount}
          subtitle="Low engagement flags"
          icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
          colorClass="bg-amber-500 text-amber-600"
          onClick={() => onNavigate('participants', 'Low')}
        />
        <StatCard 
          title="Current Week" 
          value={`Week ${stats.currentWeek}`}
          subtitle="of 12 Weeks"
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          colorClass="bg-purple-500 text-purple-600"
          onClick={() => onNavigate('progress')}
        />
      </div>

      {/* Quick Actions / Recent Alerts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Cohort Pulse</h2>
          <div className="space-y-4">
             {/* Clickable Pulse Item: Content Release */}
             <div 
                onClick={() => onNavigate('resources')}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
             >
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Week {stats.currentWeek} Content Released</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Monday, 9:00 AM - Via Classroom</p>
                   </div>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">Sent</span>
             </div>

             {/* Clickable Pulse Item: Missed Deadline */}
             <div 
                onClick={() => onNavigate('participants', 'Low')}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
             >
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{stats.flaggedCount} Participants Missed Deadline</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Week {stats.currentWeek - 1} Assignments</p>
                   </div>
                </div>
                <span className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">Review List &rarr;</span>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
           <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Certifications</h2>
           <div className="flex flex-col items-center justify-center h-48 space-y-3">
              <Award className="w-12 h-12 text-indigo-300 dark:text-slate-600" />
              <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                End of program certificates will be available in Week 12.
              </p>
              {stats.currentWeek >= 10 && (
                 <button 
                  onClick={() => onNavigate('certificates')}
                  className="mt-2 w-full py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium rounded-lg text-sm border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                   Check Eligibility
                 </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
