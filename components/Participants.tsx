
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, MessageCircle, Mail, AlertCircle, Lock, Edit, Download, AlertTriangle, Phone, CheckCircle2, X, Activity } from 'lucide-react';
import { Participant, EngagementLevel, AdminRole } from '../types';

interface ParticipantsProps {
  participants: Participant[];
  userRole: AdminRole;
  onAction: (message: string, type: 'success' | 'info' | 'error') => void;
  onOpenEmail: (recipients: Participant[]) => void;
  onOpenWhatsApp: (recipients: Participant[]) => void;
  initialFilter?: EngagementLevel | 'All';
  currentWeek: number;
}

const ParticipantProfileModal: React.FC<{ 
    participant: Participant; 
    onClose: () => void; 
    currentWeek: number;
    onEmail: () => void;
    onWhatsApp: () => void;
}> = ({ participant, onClose, currentWeek, onEmail, onWhatsApp }) => {
   // Calculations
   const weeksSoFar = participant.weeklyProgress.filter(wp => wp.weekNumber <= currentWeek);
   const completedCount = weeksSoFar.filter(wp => wp.status === 'Completed').length;
   const partialCount = weeksSoFar.filter(wp => wp.status === 'Partial').length;
   const missingCount = weeksSoFar.filter(wp => wp.status === 'Missing').length;
   
   // Attendance Calculation - Linked to weekly progress API data
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
              <div className="relative -mt-14 mb-8 flex flex-col sm:flex-row justify-between items-end gap-4">
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

              {/* Actionable Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                 <button 
                    onClick={() => { onClose(); onEmail(); }}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left group"
                 >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Email Address</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate block">{participant.email}</span>
                    </div>
                 </button>
                 <button 
                    onClick={() => { onClose(); onWhatsApp(); }}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800 transition-all text-left group"
                 >
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">WhatsApp Number</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate block">{participant.whatsapp}</span>
                    </div>
                 </button>
              </div>

              {/* Stats Grid */}
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Performance Overview (Week 1 - {currentWeek})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                 <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center shadow-sm">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{participant.completionRate}%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Assignments</p>
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
                    <p className="text-3xl font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1">
                       {participant.engagementScore}<span className="text-sm font-normal">%</span>
                    </p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Engagement</p>
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

const Participants: React.FC<ParticipantsProps> = ({ participants, userRole, onAction, onOpenEmail, onOpenWhatsApp, initialFilter = 'All', currentWeek }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEngagement, setFilterEngagement] = useState<EngagementLevel | 'All'>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Sync internal filter state when initialFilter prop changes (e.g. navigation from dashboard)
  useEffect(() => {
    setFilterEngagement(initialFilter);
  }, [initialFilter]);

  // Close dropdown when scrolling
  useEffect(() => {
    const handleScroll = () => setOpenMenuId(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEngagement === 'All' || p.engagementLevel === filterEngagement;
    return matchesSearch && matchesFilter;
  });

  const getEngagementColor = (level: EngagementLevel) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isViewer = userRole === 'Viewer';

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Participants</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage students, statuses, and interventions.</p>
        </div>
        
        {/* RBAC Action Controls */}
        <div className="flex gap-3">
          {isViewer ? (
             <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-500 border border-slate-200 dark:border-slate-700">
               <Lock className="w-3 h-3" />
               Bulk Actions Disabled
             </div>
          ) : (
            <>
              <button 
                onClick={() => onOpenEmail(filteredParticipants)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button 
                onClick={() => onOpenWhatsApp(filteredParticipants)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button 
                onClick={() => onAction('Exporting participant list to CSV...', 'success')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-white"
            value={filterEngagement}
            onChange={(e) => setFilterEngagement(e.target.value as EngagementLevel | 'All')}
          >
            <option value="All">All Levels</option>
            <option value="High">High Engagement</option>
            <option value="Medium">Medium Engagement</option>
            <option value="Low">Low Engagement</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="overflow-auto custom-scrollbar flex-1 pb-40"> {/* pb-40 allows space for dropdown at bottom */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Participant</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredParticipants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4">
                    <button onClick={() => setSelectedParticipant(p)} className="flex items-center gap-3 text-left w-full group">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs group-hover:scale-110 transition-transform">
                        {p.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{p.fullName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Joined {p.joinDate}</p>
                      </div>
                      {p.isFlagged && <AlertCircle className="w-4 h-4 text-red-500 ml-2" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEngagementColor(p.engagementLevel)}`}>
                      {p.engagementLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{p.email}</span>
                      <span className="text-slate-400 text-xs">{p.whatsapp}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-24">
                          <div 
                            className={`h-2 rounded-full ${p.completionRate >= 80 ? 'bg-green-500' : p.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${p.completionRate}%` }}
                          ></div>
                       </div>
                       <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{p.completionRate}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end relative">
                      {!isViewer && (
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                            className={`p-2 rounded-lg transition-colors ${openMenuId === p.id ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {openMenuId === p.id && (
                            <>
                              {/* Backdrop to close menu when clicking outside */}
                              <div 
                                className="fixed inset-0 z-20 cursor-default" 
                                onClick={() => setOpenMenuId(null)}
                              ></div>
                              
                              {/* Dropdown Menu */}
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-1">
                                  <button 
                                    onClick={() => {
                                      onOpenWhatsApp([p]);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md flex items-center gap-2"
                                  >
                                    <MessageCircle className="w-4 h-4 text-green-500" />
                                    Message
                                  </button>
                                  <button 
                                    onClick={() => {
                                      onOpenEmail([p]);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md flex items-center gap-2"
                                  >
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    Send Email
                                  </button>
                                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                  <button 
                                    onClick={() => {
                                      onAction(`Opening editor for ${p.fullName}...`, 'info');
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4 text-slate-400" />
                                    Update Participant
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredParticipants.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No participants found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedParticipant && (
         <ParticipantProfileModal 
            participant={selectedParticipant} 
            onClose={() => setSelectedParticipant(null)} 
            currentWeek={currentWeek}
            onEmail={() => onOpenEmail([selectedParticipant])}
            onWhatsApp={() => onOpenWhatsApp([selectedParticipant])}
         />
      )}
    </div>
  );
};

export default Participants;
