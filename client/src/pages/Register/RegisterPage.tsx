import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsEmailValid(isValid);
  }, [email]);

  const onRegister = async () => {
    const res = await api.register(email, password);
    if (res.success && res.data) {
      localStorage.setItem("token", res?.data?.accessToken);
      toast.success(
        "Registration successful! Redirecting to your dashboard..."
      );
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
      <Typography variant="h4">Register</Typography>
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
          error={!isEmailValid}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Repeat Password"
          variant="outlined"
          type="password"
          autoComplete="current-password"
          error={password !== repeatPassword}
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
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
          disabled={
            email === "" ||
            !isEmailValid ||
            password === "" ||
            repeatPassword === "" ||
            password !== repeatPassword
          }
          onClick={onRegister}
        >
          Register
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            navigate("/login");
          }}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
};
