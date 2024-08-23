import { Box, Divider, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { socket } from "../../socket";
import { AddAlertComponent } from "./components/AddAlert";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, AlertStatus } from "../../utils/types";
import { api, StatsResponse } from "../../services/api";
import { columns } from "./utils";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const normalizeAlerts = (alerts: Alert[]) => {
  return alerts.map((alert) => ({
    id: alert._id,
    severity: alert.severity,
    status: alert.status,
    type: alert.type,
    description: alert.description,
    timestamp: alert.timestamp,
  }));
};

const decodeToken = (token: string): { id: string } => jwtDecode(token) || {};

export const DashboardPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<StatsResponse>({
    total: 0,
    open: 0,
    closed: 0,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const onStatusChange = useCallback(
    async (id: string, status: AlertStatus) => {
      const res = await api.updateAlert(id, status);
      if (res.success) {
        toast.success("Alert Status updated!");
        setAlerts((prev) =>
          prev.map((alert) => {
            if (alert._id === id) {
              return { ...alert, status };
            }
            return alert;
          })
        );
      } else {
        toast.error("Alert Status update failed");
      }
    },
    []
  );

  useEffect(() => {
    api
      .getAlertsStatistics()
      .then((res) => {
        if (res?.success && res?.data && res?.data?.statistics) {
          const { total, open, closed } = res.data.statistics;
          setStats({
            total,
            open,
            closed,
          });
        }
      })
      .catch((error) => {
        console.error({ error });
      });
  }, [alerts]);

  const getAlerts = useCallback(async () => {
    const { page, pageSize } = paginationModel;
    const res = await api.getAlerts(page, pageSize);
    if (res.success && res.data) {
      const { alerts, totalCount } = res.data;
      setTotalCount(totalCount);
      if (page > 0) {
        setAlerts((prev) => [...prev, ...alerts]);
      } else {
        setAlerts(res?.data?.alerts);
      }
    } else {
      console.error({ error: res.error });
    }
  }, [paginationModel]);

  useEffect(() => {
    getAlerts();
  }, [paginationModel, getAlerts]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const { id: userId } = decodeToken(token);
    if (!userId) {
      return;
    }

    socket.connect();

    function handleNewAlert(value: Alert) {
      toast.success("New alert received");
      setAlerts((prev) => [value, ...prev]);
    }

    // should be replaced with token for better security in the future
    socket.on(`newAlert_${userId}`, handleNewAlert);

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 4,
      }}
    >
      <Box>
        <Toaster />
      </Box>
      <Typography variant="h4">Dashboard</Typography>
      <Divider
        sx={{
          my: 2,
        }}
      />
      <AddAlertComponent
        toastHandler={toast}
        onSubmit={() => {
          setPaginationModel({ ...paginationModel, page: 0 });
        }}
      />
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          p: 2,
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 2,
            py: 1,
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2">Total Alerts</Typography>
          <Typography variant="h6">{stats.total}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 2,
            py: 1,
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2">Total Open Alerts</Typography>
          <Typography variant="h6">{stats.open}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 2,
            py: 1,
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2">Total Closed Alerts</Typography>
          <Typography variant="h6">{stats.closed}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box width={"100%"}>
        {alerts.length > 0 && (
          <DataGrid
            rows={normalizeAlerts(
              alerts.slice(
                paginationModel.page * paginationModel.pageSize,
                paginationModel.pageSize * (paginationModel.page + 1)
              )
            )}
            columns={columns(onStatusChange)}
            rowHeight={80}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            rowCount={totalCount}
          />
        )}
      </Box>
    </Box>
  );
};
