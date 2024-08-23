import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { api } from "../../../services/api";
import { AlertSeverity, AlertType } from "../../../utils/types";
import ToastHandler from "react-hot-toast";

export const AddAlertComponent: React.FC<{
  toastHandler: typeof ToastHandler;
  onSubmit: () => void;
}> = ({ toastHandler, onSubmit }) => {
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<AlertType>(AlertType.Phishing);
  const [severity, setSeverity] = useState<AlertSeverity>(AlertSeverity.LOW);
  const [error, setError] = useState("");

  const resetForm = () => {
    setDescription("");
    setType(AlertType.Phishing);
    setSeverity(AlertSeverity.LOW);
    setError("");
  };

  const onClick = async () => {
    const res = await api.createAlert({
      description,
      severity,
      type,
    });
    if (res.success) {
      resetForm();
      onSubmit();
    } else {
      toastHandler.error("Failed to create alert");
      if (res.error) {
        setError(res.error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Typography variant="h6">Add new alert</Typography>
      <Box
        sx={{
          m: 2,
          display: "flex",
          // flexDirection: "column",
          gap: 2,
        }}
      >
        <FormControl>
          <InputLabel id="add-select-type-label">Type</InputLabel>
          <Select
            labelId="add-select-type-label"
            id="add-select-type"
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value as AlertType)}
          >
            {Object.values(AlertType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="add-select-severity-label">Severity</InputLabel>
          <Select
            labelId="add-select-severity-label"
            id="add-select-severity"
            value={severity}
            label="Severity"
            onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
          >
            {Object.values(AlertSeverity).map((severity) => (
              <MenuItem key={severity} value={severity}>
                {severity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={
            !description || !type || !severity || description.length < 5
          }
          onClick={onClick}
        >
          Submit
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {error && (
          <Box
            justifyContent={"center"}
            sx={{
              display: "flex",
            }}
          >
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
