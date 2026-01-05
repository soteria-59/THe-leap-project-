
import React from 'react';
import { Participant, AssignmentStatus } from '../types';
import { Check, Clock, AlertTriangle, Minus, CheckCircle2, XCircle, Activity } from 'lucide-react';

interface ProgressMatrixProps {
  participants: Participant[];
  currentWeek: number;
}

const StatusCell: React.FC<{ status: AssignmentStatus }> = ({ status }) => {
  let color = 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'; // Pending
  let icon = <Minus className="w-3 h-3" />;

  if (status === 'Completed') {
    color = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800';
    icon = <Check className="w-3 h-3" />;
  } else if (status === 'Partial') {
    color = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
    icon = <Clock className="w-3 h-3" />;
  } else if (status === 'Missing') {
    color = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800';
    icon = <AlertTriangle className="w-3 h-3" />;
  }

  return (
    <div className={`w-8 h-8 rounded-md flex items-center justify-center mx-auto transition-colors ${color}`}>
      {icon}
    </div>
  );
};

const ProgressMatrix: React.FC<ProgressMatrixProps> = ({ participants, currentWeek }) => {
  // ATTENDANCE LOGIC:
  // Derived directly from the weekly status columns.
  const weekStats = participants.reduce((acc, p) => {
      const status = p.weeklyProgress.find(w => w.weekNumber === currentWeek)?.status;
      if (status === 'Completed') acc.completed++;
      if (status === 'Partial') acc.partial++;
      if (status === 'Missing') acc.missing++;
      return acc;
  }, { completed: 0, partial: 0, missing: 0 });
  
  const totalActive = participants.length;
  const submittedCount = weekStats.completed + weekStats.partial;
  const submissionRate = Math.round((submittedCount / totalActive) * 100) || 0;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Master Progress Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400">Live integration with Google Classroom & Sheets.</p>
        </div>
        <div className="flex items-center gap-4 text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 bg-green-100 text-green-700 border border-green-200 rounded flex items-center justify-center"><Check className="w-2 h-2" /></div>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Complete</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded flex items-center justify-center"><Clock className="w-2 h-2" /></div>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Partial</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 bg-red-100 text-red-700 border border-red-200 rounded flex items-center justify-center"><AlertTriangle className="w-2 h-2" /></div>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Missing</span>
          </div>
        </div>
      </div>

      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-indigo-600 rounded-xl p-4 sm:p-5 text-white shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <p className="text-indigo-100 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Current Cycle</p>
                    <h2 className="text-2xl sm:text-3xl font-bold">Week {currentWeek}</h2>
                    <p className="text-indigo-100 text-xs mt-1 opacity-80">of 12 Weeks</p>
                </div>
                <div className="relative z-10 p-2 bg-white/20 rounded-lg hidden sm:block">
                    <Clock className="w-6 h-6 text-white" />
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attendance</p>
                        <p className="text-[10px] sm:text-xs text-slate-400">Submitted / Active</p>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{submittedCount}<span className="text-xs sm:text-sm text-slate-400 font-normal">/{totalActive}</span></span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 sm:h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${submissionRate}%` }}></div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 border border-green-100 dark:border-green-900/50 shrink-0">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Completed</p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{weekStats.completed}</p>
                      <p className="text-[10px] sm:text-xs text-green-600 font-medium truncate">On Track</p>
                    </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 border border-red-100 dark:border-red-900/50 shrink-0">
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Missing</p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{weekStats.missing}</p>
                      <p className="text-[10px] sm:text-xs text-red-500 font-medium truncate">Needs Attention</p>
                    </div>
            </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col relative">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-20">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-900 z-30 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)] border-r border-slate-200 dark:border-slate-700 min-w-[200px]">
                  Participant
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-16" title="Academic Completion Rate">
                  %
                </th>
                {Array.from({ length: 12 }).map((_, i) => (
                  <th key={i} className={`p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center min-w-[60px] ${i + 1 === currentWeek ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : ''}`}>
                    W{i + 1}
                  </th>
                ))}
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center bg-slate-100 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700">
                  Engagement
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center bg-slate-100 dark:bg-slate-800">
                  Assessments
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="p-4 sticky left-0 bg-white dark:bg-slate-800 z-10 border-r border-slate-200 dark:border-slate-700">
                    <div className={`font-medium text-sm flex items-center gap-2 w-full ${p.isFlagged ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                      {p.fullName}
                      {p.isFlagged && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                    </div>
                  </td>
                  
                  <td className="p-3 text-center">
                    <span className={`text-xs font-bold ${
                      p.completionRate >= 80 ? 'text-green-600' : 
                      p.completionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {p.completionRate}%
                    </span>
                  </td>

                  {p.weeklyProgress.map((wp) => (
                    <td key={wp.weekNumber} className={`p-3 text-center border-l border-slate-100 dark:border-slate-800 ${wp.weekNumber === currentWeek ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                      <StatusCell status={wp.status} />
                    </td>
                  ))}

                  {/* Replaced Journals Count with Engagement Rate Percentage */}
                  <td className="p-3 text-center border-l border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                     <div className="flex items-center justify-center gap-1.5">
                       <Activity className="w-3 h-3 text-slate-400" />
                       <span className={`text-sm font-bold ${
                         p.engagementScore >= 75 ? 'text-green-600' :
                         p.engagementScore >= 50 ? 'text-yellow-600' : 'text-red-500'
                       }`}>
                         {p.engagementScore}%
                       </span>
                     </div>
                  </td>
                  
                  <td className="p-3 text-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= p.selfAssessmentsCompleted ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-600'}`}></div>
                      ))}
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

export default ProgressMatrix;
