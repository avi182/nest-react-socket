import { Alert } from '../schema/alerts.schema';

export interface CreateAlertInput
  extends Omit<
    Alert,
    'status' | 'userId' | 'createdAt' | 'updatedAt' | 'id' | '_id'
  > {}
