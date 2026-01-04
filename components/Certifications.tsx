import React from 'react';
import { Participant } from '../types';
import { Award, Download, Send, CheckCircle2, XCircle } from 'lucide-react';

interface CertificationsProps {
  participants: Participant[];
  onAction: (message: string, type: 'success' | 'info' | 'error') => void;
  onOpenEmail: (recipients: Participant[]) => void;
}

const Certifications: React.FC<CertificationsProps> = ({ participants, onAction, onOpenEmail }) => {
  // Logic: 12 weeks complete (or mostly), 12 journals, 3 assessments
  // Relaxing logic slightly for mock data visualization
  const eligible = participants.filter(p => p.completionRate >= 90);
  const ineligible = participants.filter(p => p.completionRate < 90);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Certification Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Generate and issue completion certificates.</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={() => onOpenEmail(eligible)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
                <Send className="w-4 h-4" />
                Email All Eligible
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
             <div className="flex items-center gap-4">
                 <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                     <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                     <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Eligible to Graduate</p>
                     <p className="text-2xl font-bold text-slate-900 dark:text-white">{eligible.length}</p>
                 </div>
             </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
             <div className="flex items-center gap-4">
                 <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                     <XCircle className="w-6 h-6" />
                 </div>
                 <div>
                     <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Requirements Unmet</p>
                     <p className="text-2xl font-bold text-slate-900 dark:text-white">{ineligible.length}</p>
                 </div>
             </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Eligible Candidates</h3>
        </div>
        <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Participant</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Completion Score</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {eligible.map(p => (
                    <tr key={p.id}>
                        <td className="p-4 font-medium text-slate-900 dark:text-white">{p.fullName}</td>
                        <td className="p-4">
                            <span className="text-green-600 font-bold">{p.completionRate}%</span>
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => onAction(`Generating PDF preview for ${p.fullName}...`, 'info')}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg" 
                                  title="Preview Certificate"
                                >
                                    <Award className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => onAction(`Downloading certificate for ${p.fullName}...`, 'success')}
                                  className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" 
                                  title="Download PDF"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {eligible.length === 0 && (
                    <tr>
                        <td colSpan={3} className="p-8 text-center text-slate-500">No participants currently meet the graduation criteria.</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Certifications;