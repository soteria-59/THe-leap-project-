
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MoreHorizontal, MessageCircle, Mail, AlertCircle, Lock, Edit } from 'lucide-react';
import { Participant, EngagementLevel, AdminRole } from '../types';

interface ParticipantsProps {
  participants: Participant[];
  userRole: AdminRole;
  onAction: (message: string, type: 'success' | 'info' | 'error') => void;
  onOpenEmail: (recipients: Participant[]) => void;
  onOpenWhatsApp: (recipients: Participant[]) => void;
  initialFilter?: EngagementLevel | 'All';
}

const Participants: React.FC<ParticipantsProps> = ({ participants, userRole, onAction, onOpenEmail, onOpenWhatsApp, initialFilter = 'All' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEngagement, setFilterEngagement] = useState<EngagementLevel | 'All'>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
                Bulk Email ({filteredParticipants.length})
              </button>
              <button 
                onClick={() => onAction('Exporting participant list to CSV...', 'success')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Export CSV
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                        {p.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{p.fullName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Joined {p.joinDate}</p>
                      </div>
                      {p.isFlagged && <AlertCircle className="w-4 h-4 text-red-500 ml-2" />}
                    </div>
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
                                    WhatsApp
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
    </div>
  );
};

export default Participants;
