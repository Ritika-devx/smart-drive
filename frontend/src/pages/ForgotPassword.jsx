import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiSend } from "react-icons/fi";

import { forgotPassword } from "../services/authService";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(email.trim());

      setMessage(
        response.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to process password reset request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      {/* Background */}
      <div className="forgot-background-gradient"></div>
      <div className="forgot-background-grid"></div>

      {/* Brand */}
      <div className="forgot-brand">
        <h1>Smart Drive</h1>
        <p>Intelligent Cloud Storage</p>
      </div>

      {/* Card */}
      <div className="forgot-card">

        <div className="forgot-icon">
          <FiMail />
        </div>

        <span className="forgot-tag">
          ACCOUNT RECOVERY
        </span>

        <h2>Forgot Password?</h2>

        <p className="forgot-subtitle">
          Enter your email address and we'll send you
          a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="forgot-input-box">

            <FiMail className="forgot-input-icon" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="forgot-submit-btn"
            disabled={loading}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                Send Reset Link
                <FiSend />
              </>
            )}
          </button>

        </form>

        {/* Success */}
        {message && (
          <div className="forgot-success">
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="forgot-error">
            {error}
          </div>
        )}

        {/* Back to Login */}
        <Link to="/" className="back-login-link">
          <FiArrowLeft />
          Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ForgotPassword;