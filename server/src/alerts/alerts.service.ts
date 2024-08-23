import { Injectable } from '@nestjs/common';
import { AlertsDAL } from './alerts.dal';
import { Alert, AlertDocument, AlertStatus } from './schema/alerts.schema';
import { CreateAlertInput } from './types';
import { Types } from 'mongoose';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class AlertsService {
  constructor(
    private readonly alertsDAL: AlertsDAL,
    private readonly eventsService: EventsGateway,
  ) {}

  async createAlert(
    alert: CreateAlertInput,
    userId: Types.ObjectId,
  ): Promise<AlertDocument> {
    const newAlert = await this.alertsDAL.createAlert(alert, userId);
    // Emit an event to the client
    this.eventsService.server.emit(`newAlert_${String(userId)}`, newAlert);
    return newAlert;
  }

  async getAlerts({
    userId,
    pagination,
  }: {
    userId: Types.ObjectId;
    pagination: {
      page: number;
      pageSize: number;
    };
  }): Promise<{ alerts: AlertDocument[]; totalItems: number }> {
    return this.alertsDAL.getAlertsByUserId(userId, {
      limit: pagination?.pageSize,
      skip: pagination?.page * pagination?.pageSize,
    });
  }

  async getAlertsStatistics(
    userId: Types.ObjectId,
  ): Promise<{ [key: string]: number }> {
    return this.alertsDAL.getAlertsStatistics(userId);
  }

  async updateAlertStatus(
    alertId: Types.ObjectId,
    status: AlertStatus,
  ): Promise<AlertDocument> {
    return this.alertsDAL.updateAlert(alertId, { status });
  }
}
