
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Participants from './components/Participants';
import ProgressMatrix from './components/ProgressMatrix';
import Reminders from './components/Reminders';
import Certifications from './components/Certifications';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Resources from './components/Resources';
import { EmailComposeModal, WhatsAppComposeModal } from './components/CommunicationModals';
import { generateMockParticipants, MOCK_COHORTS, MOCK_ADMINS, MOCK_NOTIFICATIONS, MOCK_RESOURCES, MOCK_AUDIT_LOGS } from './services/mockData';
import { DashboardStats, AdminUser, Participant, Resource, AuditLogEntry, EngagementLevel } from './types';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentCohortId, setCurrentCohortId] = useState(MOCK_COHORTS[0].id);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [participantFilter, setParticipantFilter] = useState<EngagementLevel | 'All'>('All');
  
  // Data State
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);

  // Communication Modals State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<Participant[]>([]);
  
  // Auth State (Mocking a logged in user)
  const [currentUser, setCurrentUser] = useState<AdminUser>(MOCK_ADMINS[0]);

  // Notifications State
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Reset view to dashboard when user switches
  useEffect(() => {
    setActiveView('dashboard');
  }, [currentUser.id]);

  // Navigation with optional filter support
  const handleNavigate = (view: string, filter?: string) => {
    setActiveView(view);
    if (view === 'participants' && filter) {
      setParticipantFilter(filter as EngagementLevel | 'All');
    } else {
      // Reset filter when navigating to participants normally, or leave as is?
      // Better to reset to 'All' if no specific filter is requested for clarity
      if (view === 'participants' && !filter) {
         setParticipantFilter('All');
      }
    }
  };

  const handleAction = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        actorName: currentUser.name,
        action: action,
        details: details,
        status: 'Success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Communication Handlers
  const handleOpenEmail = (recipients: Participant[]) => {
    if (recipients.length === 0) {
      handleAction("No recipients selected.", "error");
      return;
    }
    setSelectedRecipients(recipients);
    setIsEmailModalOpen(true);
  };

  const handleOpenWhatsApp = (recipients: Participant[]) => {
    if (recipients.length === 0) {
      handleAction("No recipients selected.", "error");
      return;
    }
    setSelectedRecipients(recipients);
    setIsWhatsAppModalOpen(true);
  };

  const handleSendEmail = (subject: string, body: string, attachments: Resource[]) => {
      // Logic to actually send email would go here
      const attachInfo = attachments.length > 0 ? ` with ${attachments.length} attachments` : '';
      handleAction(`Email sent to ${selectedRecipients.length} recipients${attachInfo}`, 'success');
      addAuditLog('SEND_EMAIL', `Subject: "${subject}" to ${selectedRecipients.length} recipients. Attachments: ${attachments.length}`);
  };

  const handleSendWhatsApp = (message: string, attachments: Resource[]) => {
      // Logic to send WA
      const attachInfo = attachments.length > 0 ? ` with ${attachments.length} attachments` : '';
      handleAction(`WhatsApp message sent to ${selectedRecipients.length} recipients${attachInfo}`, 'success');
      addAuditLog('SEND_WHATSAPP', `Message sent to ${selectedRecipients.length} recipients. Attachments: ${attachments.length}`);
  };

  // Resource Handlers
  const handleAddResource = (res: Resource) => {
      setResources(prev => [res, ...prev]);
      addAuditLog('ADD_RESOURCE', `Added new resource: ${res.title}`);
  };

  const handleDeleteResource = (id: string) => {
      const res = resources.find(r => r.id === id);
      setResources(prev => prev.filter(r => r.id !== id));
      handleAction('Resource deleted', 'info');
      addAuditLog('DELETE_RESOURCE', `Deleted resource: ${res?.title || id}`);
  };

  // Mock Data Logic
  const currentWeek = 8;
  const participants = useMemo(() => generateMockParticipants(45, currentWeek), [currentCohortId]);

  const stats: DashboardStats = {
    totalParticipants: participants.length,
    activeParticipants: participants.filter(p => p.onboardingStatus === 'Joined').length,
    avgCompletionRate: Math.round(participants.reduce((acc, p) => acc + p.completionRate, 0) / participants.length),
    flaggedCount: participants.filter(p => p.isFlagged).length,
    certificatesIssued: 0,
    currentWeek: currentWeek
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard stats={stats} onNavigate={handleNavigate} />;
      case 'participants':
        return <Participants 
          participants={participants} 
          userRole={currentUser.role} 
          onAction={handleAction} 
          onOpenEmail={handleOpenEmail}
          onOpenWhatsApp={handleOpenWhatsApp}
          initialFilter={participantFilter}
          currentWeek={currentWeek}
        />;
      case 'progress':
        return <ProgressMatrix participants={participants} currentWeek={currentWeek} />;
      case 'reminders':
        return <Reminders 
          participants={participants} 
          onAction={handleAction}
          onOpenEmail={handleOpenEmail}
          onOpenWhatsApp={handleOpenWhatsApp}
        />;
      case 'resources':
        // Double check permission
        if (currentUser.role === 'Viewer') return <div>Access Denied</div>;
        return <Resources 
            resources={resources}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
            onAction={handleAction}
        />;
      case 'certificates':
        if (currentUser.role !== 'Super Admin') return <div>Access Denied</div>;
        return <Certifications 
          participants={participants} 
          onAction={handleAction}
          onOpenEmail={handleOpenEmail}
        />;
      case 'analytics':
        return <Analytics participants={participants} />;
      case 'settings':
         if (currentUser.role !== 'Super Admin') return <div>Access Denied</div>;
        return <Settings onAction={handleAction} auditLogs={auditLogs} />;
      default:
        return <Dashboard stats={stats} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout
      activeView={activeView}
      onNavigate={handleNavigate}
      cohorts={MOCK_COHORTS}
      currentCohortId={currentCohortId}
      onCohortChange={setCurrentCohortId}
      currentUser={currentUser}
      notifications={notifications}
      onMarkAllRead={markAllNotificationsRead}
      onSwitchUser={setCurrentUser}
      availableUsers={MOCK_ADMINS}
      toast={toast}
      onCloseToast={() => setToast(null)}
    >
      {renderContent()}

      {/* Communication Modals */}
      <EmailComposeModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        recipients={selectedRecipients}
        onSend={handleSendEmail}
        availableResources={resources}
      />
      
      <WhatsAppComposeModal 
        isOpen={isWhatsAppModalOpen} 
        onClose={() => setIsWhatsAppModalOpen(false)} 
        recipients={selectedRecipients}
        onSend={handleSendWhatsApp}
        availableResources={resources}
      />

    </Layout>
  );
};

export default App;
