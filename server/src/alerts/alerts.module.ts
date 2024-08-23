import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './schema/alerts.schema';
import { AlertsDAL } from './alerts.dal';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
    EventsModule,
  ],
  providers: [AlertsDAL, AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}
