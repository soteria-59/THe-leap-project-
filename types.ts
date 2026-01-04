
export type OnboardingStatus = 'Invited' | 'Joined' | 'Dropped';
export type EngagementLevel = 'High' | 'Medium' | 'Low';
export type AssignmentStatus = 'Completed' | 'Partial' | 'Missing' | 'Pending';

export interface WeeklyProgress {
  weekNumber: number;
  status: AssignmentStatus;
  score?: number; // Optional grade
}

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  joinDate: string;
  onboardingStatus: OnboardingStatus;
  engagementLevel: EngagementLevel;
  profileImage?: string;
  notes?: string;
  
  // Progress Data
  weeklyProgress: WeeklyProgress[]; // Array of 12 weeks
  journalingCount: number; // Max 12
  selfAssessmentsCompleted: number; // Max 3
  accountabilityCheckins: number;
  
  // Computed flags
  isFlagged: boolean;
  completionRate: number; // 0-100
}

export interface Cohort {
  id: string;
  name: string;
  startDate: string;
  status: 'Active' | 'Completed' | 'Upcoming';
}

export interface DashboardStats {
  totalParticipants: number;
  activeParticipants: number;
  avgCompletionRate: number;
  flaggedCount: number;
  certificatesIssued: number;
  currentWeek: number;
}

// Security & Alerts Types
export type AdminRole = 'Super Admin' | 'Program Manager' | 'Viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
}

export type NotificationType = 'critical' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface ReminderLog {
  id: string;
  date: string;
  template: string;
  recipientCount: number;
  deliveryRate: number; // percentage
  status: 'Sent' | 'Scheduled' | 'Failed';
}

// Resources & Learning Tracks
export type ResourceType = 'File' | 'Video' | 'Link';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string; // or file path
  assignedWeek: number | null; // null if general resource
  tags: string[];
  uploadDate: string;
}

// Audit Trail
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  action: string;
  details: string;
  status: 'Success' | 'Failure';
}
