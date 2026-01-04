
import React, { useState } from 'react';
import { Participant, AssignmentStatus } from '../types';
import { Check, Clock, AlertTriangle, Minus, X, Mail, Phone, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

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

const ParticipantProfileModal: React.FC<{ participant: Participant; onClose: () => void; currentWeek: number }> = ({ participant, onClose, currentWeek }) => {
   // Calculations
   const weeksSoFar = participant.weeklyProgress.filter(wp => wp.weekNumber <= currentWeek);
   const completedCount = weeksSoFar.filter(wp => wp.status === 'Completed').length;
   const partialCount = weeksSoFar.filter(wp => wp.status === 'Partial').length;
   const missingCount = weeksSoFar.filter(wp => wp.status === 'Missing').length;
   
   // Attendance = Completed + Partial
   const attendanceRate = Math.round(((completedCount + partialCount) / Math.max(1, currentWeek)) * 100);
   const missedRate = Math.round((missingCount / Math.max(1, currentWeek)) * 100);
   const isEligible = participant.completionRate >= 80;

   return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
           {/* Header with Color coded background based on engagement */}
           <div className={`h-28 ${participant.engagementLevel === 'High' ? 'bg-green-600' : participant.engagementLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'} relative`}>
              <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/30 transition-colors">
                 <X className="w-5 h-5" />
              </button>
           </div>
           
           <div className="px-8 pb-8">
              {/* Profile Image & Basic Info */}
              <div className="relative -mt-14 mb-6 flex flex-col sm:flex-row justify-between items-end gap-4">
                 <div className="flex items-end gap-4">
                    <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-xl">
                       <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400 dark:text-slate-500">
                          {participant.fullName.charAt(0)}
                       </div>
                    </div>
                    <div className="mb-1">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {participant.fullName}
                          {participant.isFlagged && (
                             <span title="Flagged for review">
                               <AlertTriangle className="w-5 h-5 text-red-500" />
                             </span>
                          )}
                       </h2>
                       <p className="text-slate-500 dark:text-slate-400 text-sm">Joined {participant.joinDate}</p>
                    </div>
                 </div>
                 <div className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 ${isEligible ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'}`}>
                    {isEligible ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {isEligible ? 'Eligible for Certificate' : 'Eligibility At Risk'}
                 </div>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                 <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                        <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{participant.email}</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                        <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{participant.whatsapp}</span>
                 </div>
              </div>

              {/* Stats Grid */}
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Performance Overview (Week 1 - {currentWeek})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                 <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center shadow-sm">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{participant.completionRate}%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Total Completion</p>
                 </div>
                 <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center shadow-sm">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{attendanceRate}%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Attendance Rate</p>
                 </div>
                 <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center shadow-sm">
                    <p className="text-3xl font-bold text-red-500 dark:text-red-400">{missedRate}%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Missed Rate</p>
                 </div>
                 <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center shadow-sm">
                    <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{participant.journalingCount}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Journals Done</p>
                 </div>
              </div>
              
              {/* Detailed Progress Bar */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                 <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    <span>Assignment Submission Status</span>
                    <span>{completedCount + partialCount} / {currentWeek} Submitted</span>
                 </div>
                 <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(completedCount/currentWeek)*100}%` }} className="bg-green-500 h-full" title="On Time"></div>
                    <div style={{ width: `${(partialCount/currentWeek)*100}%` }} className="bg-yellow-500 h-full" title="Late/Partial"></div>
                 </div>
                 <div className="flex gap-6 mt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> On Time ({completedCount})
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> Late/Partial ({partialCount})
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div> Missing ({missingCount})
                    </div>
                 </div>
              </div>

           </div>
        </div>
     </div>
   );
}

const ProgressMatrix: React.FC<ProgressMatrixProps> = ({ participants, currentWeek }) => {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Calculate Top Stats for the current week
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
        <div className="flex items-center gap-4 text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-100 text-green-700 border border-green-200 rounded flex items-center justify-center"><Check className="w-2 h-2" /></div>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Complete</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded flex items-center justify-center"><Clock className="w-2 h-2" /></div>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-100 text-red-700 border border-red-200 rounded flex items-center justify-center"><AlertTriangle className="w-2 h-2" /></div>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Missing</span>
          </div>
        </div>
      </div>

      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Current Week */}
            <div className="bg-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Current Cycle</p>
                    <h2 className="text-3xl font-bold">Week {currentWeek}</h2>
                    <p className="text-indigo-100 text-xs mt-1 opacity-80">of 12 Weeks</p>
                </div>
                <div className="relative z-10 p-2 bg-white/20 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                </div>
            </div>
            
            {/* Card 2: Attendance Rate */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attendance Rate</p>
                        <p className="text-xs text-slate-400">Submitted vs Active</p>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{submittedCount}<span className="text-sm text-slate-400 font-normal">/{totalActive}</span></span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${submissionRate}%` }}></div>
                </div>
            </div>

            {/* Card 3: Completed */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 border border-green-100 dark:border-green-900/50">
                    <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{weekStats.completed}</p>
                    <p className="text-xs text-green-600 font-medium">On Track</p>
                    </div>
            </div>

            {/* Card 4: Missing */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 border border-red-100 dark:border-red-900/50">
                    <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Missing</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{weekStats.missing}</p>
                    <p className="text-xs text-red-500 font-medium">Needs Attention</p>
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
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-16">
                  %
                </th>
                {Array.from({ length: 12 }).map((_, i) => (
                  <th key={i} className={`p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center min-w-[60px] ${i + 1 === currentWeek ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : ''}`}>
                    W{i + 1}
                  </th>
                ))}
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center bg-slate-100 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700">
                  Journals
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center bg-slate-100 dark:bg-slate-800">
                  Assessments
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  {/* Sticky Name Column */}
                  <td className="p-4 sticky left-0 bg-white dark:bg-slate-800 z-10 border-r border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50 transition-colors">
                    <button 
                        onClick={() => setSelectedParticipant(p)}
                        className={`font-medium text-sm text-left hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline decoration-dashed underline-offset-4 flex items-center gap-2 w-full ${p.isFlagged ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}
                    >
                      {p.fullName}
                      {p.isFlagged && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                    </button>
                  </td>
                  
                  {/* Completion Rate */}
                  <td className="p-3 text-center">
                    <span className={`text-xs font-bold ${
                      p.completionRate >= 80 ? 'text-green-600' : 
                      p.completionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {p.completionRate}%
                    </span>
                  </td>

                  {/* 12 Weeks */}
                  {p.weeklyProgress.map((wp) => (
                    <td key={wp.weekNumber} className={`p-3 text-center border-l border-slate-100 dark:border-slate-800 ${wp.weekNumber === currentWeek ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                      <StatusCell status={wp.status} />
                    </td>
                  ))}

                  {/* Extras */}
                  <td className="p-3 text-center border-l border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.journalingCount}/12</span>
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

      {/* Participant Profile Modal */}
      {selectedParticipant && (
        <ParticipantProfileModal 
            participant={selectedParticipant} 
            onClose={() => setSelectedParticipant(null)} 
            currentWeek={currentWeek} 
        />
      )}
    </div>
  );
};

export default ProgressMatrix;
