import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AlertStatus } from "../../../utils/types";
import React from "react";

const StatusSelect: React.FC<{
  params: GridRenderCellParams<any, Date>;
  onStatusChange: (id: string, newStatus: AlertStatus) => void;
}> = ({ params, onStatusChange }) => {
  const [status, setStatus] = React.useState(params.row.status);

  return (
    <Box
      sx={{
        mt: 1,
      }}
    >
      <FormControl>
        <Select
          labelId="add-select-type-label"
          id="add-select-type"
          value={status}
          label="Status"
          onChange={(e) => {
            const newStatus = e.target.value as AlertStatus;
            setStatus(newStatus);
            onStatusChange(params.row.id, newStatus);
          }}
        >
          {Object.values(AlertStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export const columns = (
  onStatusChange: (id: string, newStatus: AlertStatus) => void
): GridColDef[] => {
  return [
    { field: "id", headerName: "ID", width: 150 },
    { field: "severity", headerName: "Severity", width: 150 },
    { field: "type", headerName: "Type", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params: GridRenderCellParams<any, Date>) =>
        StatusSelect({ params, onStatusChange }),
    },
    {
      field: "description",
      headerName: "Description",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 300,
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      width: 300,
      valueGetter: (value: any) => new Date(value).toLocaleString(),
    },
  ];
};
