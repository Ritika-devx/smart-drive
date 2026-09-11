import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiLock,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";

import { resetPassword } from "../services/authService";
import "../styles/ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(
        token,
        newPassword
      );

      setMessage(
        response.message || "Password reset successfully."
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(
        error.message ||
          "Unable to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">

      {/* Background */}
      <div className="reset-background-gradient"></div>
      <div className="reset-background-grid"></div>

      {/* Brand */}
      <div className="reset-brand">
        <h1>Smart Drive</h1>
        <p>Intelligent Cloud Storage</p>
      </div>

      {/* Card */}
      <div className="reset-card">

        {/* Icon */}
        <div className="reset-icon">
          <FiLock />
        </div>

        {/* Label */}
        <span className="reset-tag">
          PASSWORD RECOVERY
        </span>

        <h2>Reset Password</h2>

        <p className="reset-subtitle">
          Create a new password for your Smart Drive account.
        </p>

        <form onSubmit={handleSubmit}>

          {/* New Password */}
          <div className="reset-input-box">
            <FiLock className="reset-input-icon" />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="reset-input-box">
            <FiLock className="reset-input-icon" />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="reset-submit-btn"
            disabled={loading}
          >
            {loading ? (
              "Updating..."
            ) : (
              <>
                Update Password
                <FiCheckCircle />
              </>
            )}
          </button>
        </form>

        {/* Success */}
        {message && (
          <div className="reset-success">
            <FiCheckCircle />
            <span>{message}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="reset-error">
            {error}
          </div>
        )}

        {/* Back */}
        <Link
          to="/"
          className="reset-login-link"
        >
          <FiArrowLeft />
          Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ResetPassword;