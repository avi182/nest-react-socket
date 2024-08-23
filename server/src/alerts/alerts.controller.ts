import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Alert, AlertStatus } from './schema/alerts.schema';
import { CreateAlertInput } from './types';
import { ApiResponse } from '../utils/types';
import { AlertsService } from './alerts.service';
import { UserContext } from '../middlewares/auth/token.guard.service';
import { Types } from 'mongoose';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async createAlert(
    @Req() req: Request & { user: UserContext },
    @Body() data: CreateAlertInput,
  ): Promise<ApiResponse<{ newAlert: Alert }>> {
    try {
      const { id } = req?.user;
      const newAlert = await this.alertsService.createAlert(
        data,
        new Types.ObjectId(id),
      );
      return {
        success: true,
        data: {
          newAlert,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get()
  async getAlerts(
    @Req() req: Request & { user: UserContext },
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<ApiResponse<{ alerts: Alert[]; totalCount: number }>> {
    try {
      const { id } = req?.user;
      const { alerts, totalItems } = await this.alertsService.getAlerts({
        userId: new Types.ObjectId(id),
        pagination: {
          page,
          pageSize,
        },
      });
      return {
        success: true,
        data: {
          alerts,
          totalCount: totalItems,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Put(':id')
  async updateAlert(
    @Param('id') id: string,
    @Body('status') status: AlertStatus,
  ): Promise<ApiResponse<{ updatedAlert: Alert }>> {
    try {
      const updatedAlert = await this.alertsService.updateAlertStatus(
        new Types.ObjectId(id),
        status,
      );
      return {
        success: true,
        data: { updatedAlert },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('statistics')
  async getAlertsStatistics(
    @Req() req: Request & { user: UserContext },
  ): Promise<ApiResponse<{ statistics: { [key: string]: number } }>> {
    try {
      const { id } = req?.user;
      const statistics = await this.alertsService.getAlertsStatistics(
        new Types.ObjectId(id),
      );
      return {
        success: true,
        data: {
          statistics,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
