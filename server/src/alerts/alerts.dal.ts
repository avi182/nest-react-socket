import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Alert, AlertDocument } from './schema/alerts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAlertInput } from './types';

@Injectable()
export class AlertsDAL {
  constructor(
    @InjectModel(Alert.name) private readonly alertsModel: Model<AlertDocument>,
  ) {}

  async createAlert(
    alert: CreateAlertInput,
    userId: Types.ObjectId,
  ): Promise<AlertDocument> {
    return this.alertsModel.create({ ...alert, userId });
  }

  async getAlertsByUserId(
    userId: Types.ObjectId,
    pagination: { limit: number; skip: number },
  ): Promise<{ alerts: AlertDocument[]; totalItems: number }> {
    const { limit, skip } = pagination;
    const alerts = await this.alertsModel
      .find({
        userId,
      })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .exec();

    const totalItems = await this.alertsModel.countDocuments({ userId });

    return { alerts, totalItems };
  }

  async updateAlert(
    alertId: Types.ObjectId,
    alert: Partial<Alert>,
  ): Promise<AlertDocument> {
    return this.alertsModel
      .findByIdAndUpdate(alertId, alert, { new: true })
      .exec();
  }

  async getAlertsStatistics(
    userId: Types.ObjectId,
  ): Promise<{ [key: string]: number }> {
    const res = await this.alertsModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: {
            $sum: {
              $cond: [{ $eq: ['$status', 'open'] }, 1, 0],
            },
          },
          closed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'closed'] }, 1, 0],
            },
          },
        },
      },
    ]);
    const [result] = res;
    delete result._id;
    return result;
  }
}
