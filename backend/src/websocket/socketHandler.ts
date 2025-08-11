import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { supabase } from '../config/database';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  organizationId?: string;
  role?: string;
}

interface SocketData {
  userId: string;
  organizationId: string;
  role: string;
}

// Real-time event types
export enum SocketEvents {
  // Connection events
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  JOIN_ORGANIZATION = 'join:organization',
  LEAVE_ORGANIZATION = 'leave:organization',
  
  // Lead events
  LEAD_CREATED = 'lead:created',
  LEAD_UPDATED = 'lead:updated',
  LEAD_DELETED = 'lead:deleted',
  LEAD_STAGE_CHANGED = 'lead:stage_changed',
  
  // Customer events
  CUSTOMER_CREATED = 'customer:created',
  CUSTOMER_UPDATED = 'customer:updated',
  CUSTOMER_DELETED = 'customer:deleted',
  
  // Deal events
  DEAL_CREATED = 'deal:created',
  DEAL_UPDATED = 'deal:updated',
  DEAL_DELETED = 'deal:deleted',
  DEAL_STAGE_CHANGED = 'deal:stage_changed',
  
  // Bill events
  BILL_CREATED = 'bill:created',
  BILL_UPDATED = 'bill:updated',
  BILL_STATUS_CHANGED = 'bill:status_changed',
  
  // Support ticket events
  TICKET_CREATED = 'ticket:created',
  TICKET_UPDATED = 'ticket:updated',
  TICKET_STATUS_CHANGED = 'ticket:status_changed',
  TICKET_ASSIGNED = 'ticket:assigned',
  
  // Note events
  NOTE_CREATED = 'note:created',
  NOTE_UPDATED = 'note:updated',
  NOTE_DELETED = 'note:deleted',
  
  // User activity
  USER_ACTIVITY = 'user:activity',
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
  
  // Notifications
  NOTIFICATION_NEW = 'notification:new',
  NOTIFICATION_READ = 'notification:read',
  
  // Dashboard updates
  DASHBOARD_UPDATE = 'dashboard:update',
  STATS_UPDATE = 'stats:update',
  
  // Error events
  ERROR = 'error',
  UNAUTHORIZED = 'unauthorized'
}

export class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, Set<string>> = new Map(); // organizationId -> Set of socketIds

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on(SocketEvents.CONNECTION, (socket: AuthenticatedSocket) => {
      logger.info(`Socket connected: ${socket.id} for user: ${socket.userId}`);

      // Join organization room
      this.handleJoinOrganization(socket);

      // Track user as online
      this.handleUserOnline(socket);

      // Handle disconnection
      socket.on(SocketEvents.DISCONNECT, () => {
        this.handleUserOffline(socket);
        logger.info(`Socket disconnected: ${socket.id}`);
      });

      // Entity event handlers
      this.setupEntityEventHandlers(socket);

      // Activity tracking
      this.setupActivityTracking(socket);

      // Notification handlers
      this.setupNotificationHandlers(socket);
    });
  }

  private handleJoinOrganization(socket: AuthenticatedSocket) {
    if (socket.organizationId) {
      socket.join(`org:${socket.organizationId}`);
      
      // Track connected user
      if (!this.connectedUsers.has(socket.organizationId)) {
        this.connectedUsers.set(socket.organizationId, new Set());
      }
      this.connectedUsers.get(socket.organizationId)!.add(socket.id);

      logger.info(`User ${socket.userId} joined organization ${socket.organizationId}`);
    }
  }

  private handleUserOnline(socket: AuthenticatedSocket) {
    if (socket.organizationId && socket.userId) {
      // Broadcast user online status to organization
      socket.to(`org:${socket.organizationId}`).emit(SocketEvents.USER_ONLINE, {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      });

      // Update user's last seen in database
      this.updateUserLastSeen(socket.userId);
    }
  }

  private handleUserOffline(socket: AuthenticatedSocket) {
    if (socket.organizationId && socket.userId) {
      // Remove from connected users
      const orgUsers = this.connectedUsers.get(socket.organizationId);
      if (orgUsers) {
        orgUsers.delete(socket.id);
        if (orgUsers.size === 0) {
          this.connectedUsers.delete(socket.organizationId);
        }
      }

      // Broadcast user offline status
      socket.to(`org:${socket.organizationId}`).emit(SocketEvents.USER_OFFLINE, {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      });

      // Update user's last seen
      this.updateUserLastSeen(socket.userId);
    }
  }

  private setupEntityEventHandlers(socket: AuthenticatedSocket) {
    // Lead events
    socket.on('lead:update', (data) => this.handleEntityUpdate(socket, 'lead', data));
    socket.on('lead:create', (data) => this.handleEntityCreate(socket, 'lead', data));
    socket.on('lead:delete', (data) => this.handleEntityDelete(socket, 'lead', data));

    // Customer events
    socket.on('customer:update', (data) => this.handleEntityUpdate(socket, 'customer', data));
    socket.on('customer:create', (data) => this.handleEntityCreate(socket, 'customer', data));
    socket.on('customer:delete', (data) => this.handleEntityDelete(socket, 'customer', data));

    // Deal events
    socket.on('deal:update', (data) => this.handleEntityUpdate(socket, 'deal', data));
    socket.on('deal:create', (data) => this.handleEntityCreate(socket, 'deal', data));
    socket.on('deal:delete', (data) => this.handleEntityDelete(socket, 'deal', data));

    // Bill events
    socket.on('bill:update', (data) => this.handleEntityUpdate(socket, 'bill', data));
    socket.on('bill:create', (data) => this.handleEntityCreate(socket, 'bill', data));

    // Support ticket events
    socket.on('ticket:update', (data) => this.handleEntityUpdate(socket, 'ticket', data));
    socket.on('ticket:create', (data) => this.handleEntityCreate(socket, 'ticket', data));
    socket.on('ticket:assign', (data) => this.handleTicketAssignment(socket, data));
  }

  private setupActivityTracking(socket: AuthenticatedSocket) {
    socket.on('user:activity', (data) => {
      if (socket.organizationId) {
        // Log activity to database
        this.logUserActivity(socket.userId!, data.action, data.entityType, data.entityId);

        // Broadcast activity to organization (excluding sender)
        socket.to(`org:${socket.organizationId}`).emit(SocketEvents.USER_ACTIVITY, {
          userId: socket.userId,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  private setupNotificationHandlers(socket: AuthenticatedSocket) {
    socket.on('notification:read', (notificationId) => {
      // Mark notification as read in database
      this.markNotificationAsRead(notificationId, socket.userId!);
    });
  }

  private async handleEntityCreate(socket: AuthenticatedSocket, entityType: string, data: any) {
    try {
      if (!socket.organizationId) return;

      // Broadcast to organization
      socket.to(`org:${socket.organizationId}`).emit(`${entityType}:created`, {
        ...data,
        createdBy: socket.userId,
        timestamp: new Date().toISOString()
      });

      // Log activity
      await this.logUserActivity(socket.userId!, 'create', entityType, data.id);

      logger.info(`${entityType} created by ${socket.userId}: ${data.id}`);
    } catch (error) {
      logger.error(`Error handling ${entityType} creation:`, error);
      socket.emit(SocketEvents.ERROR, { message: `Failed to create ${entityType}` });
    }
  }

  private async handleEntityUpdate(socket: AuthenticatedSocket, entityType: string, data: any) {
    try {
      if (!socket.organizationId) return;

      // Broadcast to organization
      socket.to(`org:${socket.organizationId}`).emit(`${entityType}:updated`, {
        ...data,
        updatedBy: socket.userId,
        timestamp: new Date().toISOString()
      });

      // Log activity
      await this.logUserActivity(socket.userId!, 'update', entityType, data.id);

      logger.info(`${entityType} updated by ${socket.userId}: ${data.id}`);
    } catch (error) {
      logger.error(`Error handling ${entityType} update:`, error);
      socket.emit(SocketEvents.ERROR, { message: `Failed to update ${entityType}` });
    }
  }

  private async handleEntityDelete(socket: AuthenticatedSocket, entityType: string, data: any) {
    try {
      if (!socket.organizationId) return;

      // Broadcast to organization
      socket.to(`org:${socket.organizationId}`).emit(`${entityType}:deleted`, {
        id: data.id,
        deletedBy: socket.userId,
        timestamp: new Date().toISOString()
      });

      // Log activity
      await this.logUserActivity(socket.userId!, 'delete', entityType, data.id);

      logger.info(`${entityType} deleted by ${socket.userId}: ${data.id}`);
    } catch (error) {
      logger.error(`Error handling ${entityType} deletion:`, error);
      socket.emit(SocketEvents.ERROR, { message: `Failed to delete ${entityType}` });
    }
  }

  private async handleTicketAssignment(socket: AuthenticatedSocket, data: any) {
    try {
      if (!socket.organizationId) return;

      // Broadcast to organization
      socket.to(`org:${socket.organizationId}`).emit(SocketEvents.TICKET_ASSIGNED, {
        ticketId: data.ticketId,
        assignedTo: data.assignedTo,
        assignedBy: socket.userId,
        timestamp: new Date().toISOString()
      });

      // Send notification to assigned user
      await this.sendNotificationToUser(data.assignedTo, {
        type: 'ticket_assigned',
        title: 'New Ticket Assigned',
        message: `You have been assigned a new support ticket`,
        data: { ticketId: data.ticketId }
      });

      logger.info(`Ticket ${data.ticketId} assigned to ${data.assignedTo} by ${socket.userId}`);
    } catch (error) {
      logger.error('Error handling ticket assignment:', error);
      socket.emit(SocketEvents.ERROR, { message: 'Failed to assign ticket' });
    }
  }

  // Public methods for external use
  public async broadcastToOrganization(organizationId: string, event: string, data: any) {
    this.io.to(`org:${organizationId}`).emit(event, data);
  }

  public async sendNotificationToUser(userId: string, notification: any) {
    try {
      // Store notification in database
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Error storing notification:', error);
        return;
      }

      // Send real-time notification if user is online
      this.io.emit(SocketEvents.NOTIFICATION_NEW, notification);
    } catch (error) {
      logger.error('Error sending notification:', error);
    }
  }

  public getConnectedUsersCount(organizationId: string): number {
    return this.connectedUsers.get(organizationId)?.size || 0;
  }

  private async updateUserLastSeen(userId: string) {
    try {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      logger.error('Error updating user last seen:', error);
    }
  }

  private async logUserActivity(userId: string, action: string, entityType: string, entityId: string) {
    try {
      await supabase
        .from('activities')
        .insert({
          created_by: userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          description: `${action} ${entityType}`,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      logger.error('Error logging user activity:', error);
    }
  }

  private async markNotificationAsRead(notificationId: string, userId: string) {
    try {
      await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', userId);
    } catch (error) {
      logger.error('Error marking notification as read:', error);
    }
  }
}

// Setup function for the WebSocket service
export const setupWebSocket = (io: SocketIOServer): WebSocketService => {
  const wsService = new WebSocketService(io);
  
  // Store service instance globally for access in other parts of the app
  (global as any).wsService = wsService;
  
  return wsService;
};

// Helper function to get WebSocket service instance
export const getWebSocketService = (): WebSocketService => {
  return (global as any).wsService;
};
