import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await api.login(email, password);
    if (res.success && res.data) {
      localStorage.setItem("token", res?.data?.accessToken);
      toast.success("Login successful! Redirecting to your dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      if (res?.error) {
        setError(res?.error);
      } else {
        setError("An error occurred");
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
        p: 4,
      }}
    >
      <Toaster />
      <Typography variant="h4">Login</Typography>
      <Box
        sx={{
          m: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
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
        <Button
          variant="contained"
          color="primary"
          disabled={email === "" || password === ""}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            navigate("/register");
          }}
        >
          Create account
        </Button>
      </Box>
    </Box>
  );
};
