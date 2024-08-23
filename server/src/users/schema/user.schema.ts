import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, _id: true, id: true, toObject: { getters: true } })
export class User {
  _id?: Types.ObjectId;
  id?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  hashedPassword: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
