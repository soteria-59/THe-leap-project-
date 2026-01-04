import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Participant } from '../types';

interface AnalyticsProps {
  participants: Participant[];
}

const Analytics: React.FC<AnalyticsProps> = ({ participants }) => {
  // Compute Engagement Data for Pie Chart
  const engagementCounts = participants.reduce((acc, p) => {
    acc[p.engagementLevel] = (acc[p.engagementLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'High', value: engagementCounts['High'] || 0, color: '#22c55e' },
    { name: 'Medium', value: engagementCounts['Medium'] || 0, color: '#eab308' },
    { name: 'Low', value: engagementCounts['Low'] || 0, color: '#ef4444' },
  ];

  // Compute Weekly Completion Data for Bar Chart
  // Aggregating status across all participants for weeks 1-12
  const weeklyData = Array.from({ length: 12 }).map((_, i) => {
    const weekNum = i + 1;
    let completed = 0;
    let total = 0;
    
    participants.forEach(p => {
        const week = p.weeklyProgress.find(wp => wp.weekNumber === weekNum);
        if (week) {
            total++;
            if (week.status === 'Completed') completed++;
        }
    });

    return {
        name: `W${weekNum}`,
        rate: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  });

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Program Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Insights into cohort performance and engagement.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Trend */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Weekly Completion Rate</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit="%" />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Bar dataKey="rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Engagement Distribution */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Engagement Distribution</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Analytics;
