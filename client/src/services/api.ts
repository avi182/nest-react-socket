import axios from "axios";
import { Alert, AlertSeverity, AlertStatus, AlertType } from "../utils/types";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StatsResponse {
  total: number;
  open: number;
  closed: number;
}

const authenticatedConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const api = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post<
      ApiResponse<{
        accessToken: string;
      }>
    >(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },
  register: async (email: string, password: string) => {
    const response = await axios.post<
      ApiResponse<{
        accessToken: string;
      }>
    >(`${BASE_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  },
  getAlerts: async (page: number, pageSize: number) => {
    const response = await axiosInstance.get<
      ApiResponse<{ alerts: Alert[]; totalCount: number }>
    >(`${BASE_URL}/alerts`, {
      ...authenticatedConfig(),
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  },
  createAlert: async (data: {
    description: string;
    severity: AlertSeverity;
    type: AlertType;
  }) => {
    const response = await axiosInstance.post<
      ApiResponse<{
        newAlert: Alert;
      }>
    >(
      `${BASE_URL}/alerts`,
      { ...data, timestamp: Date.now() },
      authenticatedConfig()
    );
    return response.data;
  },
  getAlertsStatistics: async () => {
    const response = await axiosInstance.get<
      ApiResponse<{ statistics: StatsResponse }>
    >(`${BASE_URL}/alerts/statistics`, authenticatedConfig());
    return response.data;
  },
  updateAlert: async (id: string, status: AlertStatus) => {
    const response = await axiosInstance.put<
      ApiResponse<{
        updatedAlert: Alert;
      }>
    >(`${BASE_URL}/alerts/${id}`, { status }, authenticatedConfig());
    return response.data;
  },
};
