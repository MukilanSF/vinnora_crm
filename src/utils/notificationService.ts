// Enhanced Notification Service for Customer Support Ticketing
import { SupportTicket } from './types';

export interface NotificationConfig {
  enableEmailNotifications: boolean;
  enableInAppNotifications: boolean;
  escalationRules: EscalationRule[];
  notificationTemplates: NotificationTemplates;
}

export interface EscalationRule {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeThreshold: number; // in hours
  escalateTo: string; // user role or specific user
  action: 'email' | 'assign' | 'both';
}

export interface NotificationTemplates {
  ticketCreated: string;
  ticketUpdated: string;
  ticketResolved: string;
  ticketEscalated: string;
  ticketOverdue: string;
  created: string;
  updated: string;
  resolved: string;
  escalated: string;
  overdue: string;
}

export interface NotificationEvent {
  id: string;
  ticketId: string;
  type: 'created' | 'updated' | 'resolved' | 'escalated' | 'overdue';
  timestamp: Date;
  recipients: string[];
  message: string;
  sent: boolean;
  deliveryStatus: 'pending' | 'sent' | 'failed';
}

class NotificationService {
  private config: NotificationConfig;
  private notifications: NotificationEvent[] = [];

  constructor() {
    this.config = {
      enableEmailNotifications: true,
      enableInAppNotifications: true,
      escalationRules: [
        {
          id: 'urgent-escalation',
          priority: 'urgent',
          timeThreshold: 1, // 1 hour
          escalateTo: 'admin',
          action: 'both'
        },
        {
          id: 'high-escalation',
          priority: 'high',
          timeThreshold: 4, // 4 hours
          escalateTo: 'manager',
          action: 'email'
        },
        {
          id: 'medium-escalation',
          priority: 'medium',
          timeThreshold: 24, // 24 hours
          escalateTo: 'senior-support',
          action: 'assign'
        },
        {
          id: 'low-escalation',
          priority: 'low',
          timeThreshold: 72, // 72 hours
          escalateTo: 'manager',
          action: 'email'
        }
      ],
      notificationTemplates: {
        ticketCreated: 'New support ticket #{ticketId} has been created with priority {priority}. Title: {title}',
        ticketUpdated: 'Support ticket #{ticketId} has been updated. Status: {status}',
        ticketResolved: 'Support ticket #{ticketId} has been resolved. Resolution: {resolution}',
        ticketEscalated: 'Support ticket #{ticketId} has been escalated to {escalatedTo} due to {reason}',
        ticketOverdue: 'Support ticket #{ticketId} is overdue. Created: {createdAt}, Priority: {priority}',
        created: 'New support ticket #{ticketId} has been created with priority {priority}. Title: {title}',
        updated: 'Support ticket #{ticketId} has been updated. Status: {status}',
        resolved: 'Support ticket #{ticketId} has been resolved. Resolution: {resolution}',
        escalated: 'Support ticket #{ticketId} has been escalated to {escalatedTo} due to {reason}',
        overdue: 'Support ticket #{ticketId} is overdue. Created: {createdAt}, Priority: {priority}'
      }
    };
  }

  // Create notification for ticket events
  async createNotification(
    ticket: SupportTicket, 
    type: NotificationEvent['type'], 
    additionalData?: any
  ): Promise<NotificationEvent> {
    const notification: NotificationEvent = {
      id: Math.random().toString(36).substr(2, 9),
      ticketId: ticket.id,
      type,
      timestamp: new Date(),
      recipients: this.getRecipients(ticket, type),
      message: this.generateMessage(ticket, type, additionalData),
      sent: false,
      deliveryStatus: 'pending'
    };

    this.notifications.push(notification);
    
    // Send notification
    if (this.config.enableEmailNotifications) {
      await this.sendEmailNotification(notification);
    }
    
    if (this.config.enableInAppNotifications) {
      this.showInAppNotification(notification);
    }

    return notification;
  }

  // Check for tickets that need escalation
  checkEscalation(tickets: SupportTicket[]): SupportTicket[] {
    const now = new Date();
    const escalatedTickets: SupportTicket[] = [];

    tickets.forEach(ticket => {
      if (ticket.status === 'resolved' || ticket.status === 'closed') {
        return; // Skip resolved/closed tickets
      }

      const rule = this.config.escalationRules.find(r => r.priority === ticket.priority);
      if (!rule) return;

      const ticketAge = (now.getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60); // hours
      
      if (ticketAge > rule.timeThreshold) {
        // Check if already escalated recently
        const recentEscalation = this.notifications.find(n => 
          n.ticketId === ticket.id && 
          n.type === 'escalated' && 
          (now.getTime() - n.timestamp.getTime()) < (rule.timeThreshold * 1000 * 60 * 60)
        );

        if (!recentEscalation) {
          escalatedTickets.push(ticket);
          this.createNotification(ticket, 'escalated', { 
            escalatedTo: rule.escalateTo, 
            reason: `Exceeded ${rule.timeThreshold} hour threshold` 
          });
        }
      }
    });

    return escalatedTickets;
  }

  // Get notification recipients based on ticket and event type
  private getRecipients(ticket: SupportTicket, type: NotificationEvent['type']): string[] {
    const recipients: string[] = [];
    
    // Always notify assigned person and creator
    if (ticket.assignedTo) recipients.push(ticket.assignedTo);
    if (ticket.createdBy) recipients.push(ticket.createdBy);
    
    // Add customer for certain events
    if (['created', 'updated', 'resolved'].includes(type) && ticket.contactId) {
      recipients.push(ticket.contactId);
    }

    // Add escalation recipients
    if (type === 'escalated') {
      const rule = this.config.escalationRules.find(r => r.priority === ticket.priority);
      if (rule?.escalateTo) {
        recipients.push(rule.escalateTo);
      }
    }

    return [...new Set(recipients)]; // Remove duplicates
  }

  // Generate notification message from template
  private generateMessage(
    ticket: SupportTicket, 
    type: NotificationEvent['type'], 
    additionalData?: any
  ): string {
    const template = this.config.notificationTemplates[type];
    
    return template
      .replace('{ticketId}', ticket.id)
      .replace('{title}', ticket.title)
      .replace('{priority}', ticket.priority)
      .replace('{status}', ticket.status)
      .replace('{createdAt}', new Date(ticket.createdAt).toLocaleString())
      .replace('{escalatedTo}', additionalData?.escalatedTo || '')
      .replace('{reason}', additionalData?.reason || '')
      .replace('{resolution}', additionalData?.resolution || '');
  }

  // Send email notification (mock implementation)
  private async sendEmailNotification(notification: NotificationEvent): Promise<void> {
    try {
      // Mock email sending - replace with actual email service
      console.log('📧 Sending email notification:', {
        recipients: notification.recipients,
        subject: `Support Ticket Update - ${notification.type}`,
        message: notification.message,
        timestamp: notification.timestamp
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      notification.sent = true;
      notification.deliveryStatus = 'sent';
    } catch (error) {
      console.error('Failed to send email notification:', error);
      notification.deliveryStatus = 'failed';
    }
  }

  // Show in-app notification
  private showInAppNotification(notification: NotificationEvent): void {
    // Create toast notification or update notification center
    const event = new CustomEvent('support-notification', {
      detail: {
        id: notification.id,
        message: notification.message,
        type: notification.type,
        timestamp: notification.timestamp
      }
    });
    
    window.dispatchEvent(event);
  }

  // Get all notifications
  getNotifications(): NotificationEvent[] {
    return this.notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get notifications for specific ticket
  getTicketNotifications(ticketId: string): NotificationEvent[] {
    return this.notifications
      .filter(n => n.ticketId === ticketId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.sent = true;
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): NotificationConfig {
    return this.config;
  }

  // Clear old notifications (older than 30 days)
  cleanupNotifications(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.notifications = this.notifications.filter(n => 
      n.timestamp.getTime() > thirtyDaysAgo.getTime()
    );
  }

  // Generate SLA report
  generateSLAReport(tickets: SupportTicket[]): any {
    const now = new Date();
    const slaData = {
      totalTickets: tickets.length,
      averageResolutionTime: 0,
      overdueTickets: 0,
      escalatedTickets: 0,
      slaBreaches: 0,
      performanceByPriority: {
        urgent: { total: 0, resolved: 0, avgTime: 0 },
        high: { total: 0, resolved: 0, avgTime: 0 },
        medium: { total: 0, resolved: 0, avgTime: 0 },
        low: { total: 0, resolved: 0, avgTime: 0 }
      }
    };

    tickets.forEach(ticket => {
      const priority = ticket.priority;
      slaData.performanceByPriority[priority].total++;

      if (ticket.status === 'resolved' || ticket.status === 'closed') {
        const resolutionTime = (new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
        slaData.performanceByPriority[priority].resolved++;
        slaData.performanceByPriority[priority].avgTime += resolutionTime;
      } else {
        // Check if overdue
        const rule = this.config.escalationRules.find(r => r.priority === priority);
        if (rule) {
          const ticketAge = (now.getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
          if (ticketAge > rule.timeThreshold) {
            slaData.overdueTickets++;
            slaData.slaBreaches++;
          }
        }
      }
    });

    // Calculate averages
    Object.values(slaData.performanceByPriority).forEach(priority => {
      if (priority.resolved > 0) {
        priority.avgTime = priority.avgTime / priority.resolved;
      }
    });

    const totalResolved = Object.values(slaData.performanceByPriority).reduce((sum, p) => sum + p.resolved, 0);
    const totalTime = Object.values(slaData.performanceByPriority).reduce((sum, p) => sum + (p.avgTime * p.resolved), 0);
    slaData.averageResolutionTime = totalResolved > 0 ? totalTime / totalResolved : 0;

    slaData.escalatedTickets = this.notifications.filter(n => n.type === 'escalated').length;

    return slaData;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default NotificationService;
