
import { Participant, Cohort, AssignmentStatus, WeeklyProgress, EngagementLevel, OnboardingStatus, AdminUser, Notification, ReminderLog, Resource, AuditLogEntry } from '../types';

const NAMES = [
  "Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Evans", "Ethan Hall",
  "Fiona Clark", "George Wright", "Hannah Lewis", "Ian Scott", "Julia Green",
  "Kevin Adams", "Laura Baker", "Michael Carter", "Nina Perez", "Oscar Roberts"
];

const getRandomStatus = (weight: number): AssignmentStatus => {
  const r = Math.random();
  if (r < weight) return 'Completed';
  if (r < weight + 0.1) return 'Partial';
  if (r < weight + 0.15) return 'Missing';
  return 'Pending'; // Future weeks
};

const calculateEngagement = (rate: number): EngagementLevel => {
  if (rate >= 85) return 'High';
  if (rate >= 60) return 'Medium';
  return 'Low';
};

export const generateMockParticipants = (count: number, currentWeek: number): Participant[] => {
  return Array.from({ length: count }).map((_, index) => {
    const name = NAMES[index % NAMES.length] + (index >= NAMES.length ? ` ${index}` : '');
    
    // Generate progress
    const weeklyProgress: WeeklyProgress[] = [];
    let completedTasks = 0;

    for (let w = 1; w <= 12; w++) {
      let status: AssignmentStatus = 'Pending';
      if (w < currentWeek) {
        status = getRandomStatus(0.75); // 75% chance of completion
      } else if (w === currentWeek) {
        status = Math.random() > 0.5 ? 'Completed' : 'Partial';
      }
      
      if (status === 'Completed') completedTasks++;
      
      weeklyProgress.push({
        weekNumber: w,
        status: status,
      });
    }

    const journalingCount = Math.floor(Math.random() * (currentWeek + 1));
    const selfAssessmentsCompleted = currentWeek > 8 ? Math.floor(Math.random() * 4) : currentWeek > 4 ? Math.floor(Math.random() * 2) : 0;
    
    // Simple calculation logic
    const totalDue = (currentWeek - 1) * 2; // Tasks + Journals roughly
    const actual = completedTasks + (journalingCount > currentWeek ? currentWeek : journalingCount); 
    const completionRate = Math.min(100, Math.round((actual / (Math.max(1, totalDue))) * 100));

    return {
      id: `p-${index + 1}`,
      fullName: name,
      email: `${name.toLowerCase().replace(/ /g, '.')}@example.com`,
      whatsapp: `+1 (555) 000-${1000 + index}`,
      joinDate: '2023-09-01',
      onboardingStatus: Math.random() > 0.1 ? 'Joined' : 'Invited',
      engagementLevel: calculateEngagement(completionRate),
      weeklyProgress,
      journalingCount,
      selfAssessmentsCompleted,
      accountabilityCheckins: Math.floor(Math.random() * currentWeek),
      isFlagged: completionRate < 60,
      completionRate,
      notes: Math.random() > 0.8 ? "Missed check-in last week." : ""
    };
  });
};

export const MOCK_COHORTS: Cohort[] = [
  { id: 'c-101', name: 'Cohort Alpha (Fall 2023)', startDate: '2023-09-01', status: 'Active' },
  { id: 'c-100', name: 'Cohort Beta (Spring 2023)', startDate: '2023-03-01', status: 'Completed' },
];

export const MOCK_ADMINS: AdminUser[] = [
  {
    id: 'u-1',
    name: 'Sarah Connor',
    email: 'sarah@leap.com',
    role: 'Super Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'u-2',
    name: 'John Reese',
    email: 'john@leap.com',
    role: 'Program Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 'u-3',
    name: 'Harold Finch',
    email: 'harold@leap.com',
    role: 'Viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harold'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    type: 'critical',
    title: 'Integration Error',
    message: 'WhatsApp Business API token expired. Messages are not sending.',
    timestamp: '10 mins ago',
    isRead: false
  },
  {
    id: 'n-2',
    type: 'warning',
    title: 'Low Engagement Alert',
    message: '5 participants have dropped below 50% completion rate this week.',
    timestamp: '2 hours ago',
    isRead: false,
    link: 'participants'
  },
  {
    id: 'n-3',
    type: 'info',
    title: 'Weekly Summary Ready',
    message: 'Week 7 progress report is available for review.',
    timestamp: '1 day ago',
    isRead: true
  }
];

export const MOCK_REMINDERS: ReminderLog[] = [
  { id: 'r-1', date: '2023-10-26 09:00', template: 'Week 8 Content Release', recipientCount: 45, deliveryRate: 100, status: 'Sent' },
  { id: 'r-2', date: '2023-10-23 09:00', template: 'Week 7 Accountability Nudge', recipientCount: 12, deliveryRate: 92, status: 'Sent' },
  { id: 'r-3', date: '2023-10-19 09:00', template: 'Week 7 Content Release', recipientCount: 45, deliveryRate: 98, status: 'Sent' },
  { id: 'r-4', date: '2023-10-16 09:00', template: 'Week 6 Accountability Nudge', recipientCount: 8, deliveryRate: 100, status: 'Sent' },
];

export const MOCK_RESOURCES: Resource[] = [
  { id: 'res-1', title: 'Week 1: Leadership Foundations', description: 'Core principles of leadership.', type: 'File', url: '/files/week1-guide.pdf', assignedWeek: 1, tags: ['core', 'reading'], uploadDate: '2023-08-25' },
  { id: 'res-2', title: 'Intro Video: The Why', description: 'Welcome video from the founder.', type: 'Video', url: 'https://vimeo.com/123456', assignedWeek: 1, tags: ['intro', 'video'], uploadDate: '2023-08-25' },
  { id: 'res-3', title: 'Week 2: Emotional Intelligence', description: 'Understanding EQ in the workplace.', type: 'File', url: '/files/week2-eq.pdf', assignedWeek: 2, tags: ['core', 'reading'], uploadDate: '2023-09-01' },
  { id: 'res-4', title: 'General Program Syllabus', description: 'Full 12-week schedule and requirements.', type: 'File', url: '/files/syllabus.docx', assignedWeek: null, tags: ['admin', 'info'], uploadDate: '2023-08-20' },
  { id: 'res-5', title: 'Guest Speaker Series: Simon Sinek', description: 'Recorded session from Oct 20th.', type: 'Link', url: 'https://youtube.com/watch?v=xyz', assignedWeek: 8, tags: ['bonus'], uploadDate: '2023-10-20' },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-1', timestamp: '2023-10-27 14:30', actorName: 'Sarah Connor', action: 'SETTINGS_UPDATE', details: 'Changed passing grade threshold from 75% to 80%', status: 'Success' },
  { id: 'log-2', timestamp: '2023-10-27 11:15', actorName: 'System', action: 'AUTO_REMINDER', details: 'Sent Week 8 content release to 45 participants', status: 'Success' },
  { id: 'log-3', timestamp: '2023-10-26 16:45', actorName: 'John Reese', action: 'PARTICIPANT_UPDATE', details: 'Flagged participant Alice Johnson (p-1) for manual review', status: 'Success' },
  { id: 'log-4', timestamp: '2023-10-26 09:00', actorName: 'System', action: 'SYNC_SHEETS', details: 'Weekly grade sync from Google Sheets', status: 'Success' },
  { id: 'log-5', timestamp: '2023-10-25 18:20', actorName: 'Sarah Connor', action: 'SEND_EMAIL', details: 'Bulk email sent to 12 "Low Engagement" participants', status: 'Success' },
];
