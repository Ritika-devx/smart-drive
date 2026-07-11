import { Routes, Route } from "react-router-dom";

import AppShell from "./AppShell";

import Login from "./pages/Login";
import Suggestions from "./pages/Suggestions";
import Upload from "./pages/Upload";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Login */}
      <Route path="/" element={<Login />} />

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