import { Routes, Route } from "react-router-dom";

import AppShell from "./appShell";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Suggestions from "./pages/Suggestions";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Reset Password */}
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />

      {/* Suggestions */}
      <Route
        path="/suggestions"
        element={
          <ProtectedRoute>
            <Suggestions />
          </ProtectedRoute>
        }
      />

      {/* Upload */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;