import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

enum AlertType {
  Phishing = 'Phishing',
  MalwareDetection = 'Malware Detection',
  UnauthorizedAccess = 'Unauthorized Access',
  SuspiciousLogin = 'Suspicious Login',
  DataExfiltration = 'Data Exfiltration',
}

enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum AlertStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Schema({ timestamps: true, _id: true, id: true, toObject: { getters: true } })
export class Alert {
  _id?: Types.ObjectId;
  id?: string;

  @Prop({ required: true, enum: AlertType })
  type: AlertType;

  @Prop({ required: true, enum: AlertSeverity })
  severity: AlertSeverity;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: AlertStatus, default: AlertStatus.OPEN })
  status: AlertStatus;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  userId: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export type AlertDocument = Alert & Document;
export const AlertSchema = SchemaFactory.createForClass(Alert);
