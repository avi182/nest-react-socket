export enum AlertType {
  Phishing = "Phishing",
  MalwareDetection = "Malware Detection",
  UnauthorizedAccess = "Unauthorized Access",
  SuspiciousLogin = "Suspicious Login",
  DataExfiltration = "Data Exfiltration",
}

export enum AlertSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum AlertStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export interface Alert {
  _id?: string;
  id?: string;
  type: AlertType;
  severity: AlertSeverity;
  description: string;
  status?: AlertStatus;
  timestamp: Date;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
