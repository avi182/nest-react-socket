import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";

function App() {
  const [token] = useState<string | null>(localStorage.getItem("token"));
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
    },
  ]);

  // check for token in local storage, and navigate to dashboard if token exists
  useEffect(() => {
    if (token) {
      router.navigate("/dashboard");
    } else {
      router.navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Box>
      <RouterProvider router={router} />
    </Box>
  );
}

export default App;
