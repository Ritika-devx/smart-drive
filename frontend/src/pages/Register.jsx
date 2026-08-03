import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import lampOffImg from "../assets/lamp-off.png";
import lampOnImg from "../assets/lamp-on.png";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

import "./Login.css";

import { registerUser } from "../services/authService";

/**
 * Register
 * ------------------------------------------------------------
 * Deliberately reuses Login.css and the same class names as
 * Login.jsx (login-page, login-card, input-box, login-btn, etc.)
 * so it's visually identical in structure - same lamp, same
 * glass card, same gradients - with register-specific copy and
 * fields swapped in. Any future change to Login.css applies to
 * both pages automatically.
 */
function Register() {
  const navigate = useNavigate();

  const [lampOn, setLampOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleLamp = () => {
    setLampOn((prev) => !prev);
  };

  // Auto turn the lamp on shortly after arriving here - unlike Login,
  // this page is reached by clicking "Create Account", so the form
  // should just be there waiting, not require another click to reveal.
  useEffect(() => {
    const t = setTimeout(() => setLampOn(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData.username, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1400);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${lampOn ? "lamp-on" : ""}`}>

      {/* Background */}

      <div className="background-gradient"></div>
      <div className="background-grid"></div>

      {/* Brand */}

      <motion.div
        className="brand"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Smart Drive</h1>
        <p>
          Intelligent Cloud Storage
        </p>
      </motion.div>

      {/* Left Content */}

      <motion.div
        className="hero-section"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >

        <h2>
          Join Smart Drive.
          <br />
          Store with confidence.
        </h2>

        <p>
          Create an account to unlock AI-powered suggestions,
          duplicate detection, analytics and secure storage.
        </p>

      </motion.div>

      {/* Standing Lamp */}

      <motion.div
        className="lamp-container"
        animate={{
          rotate: lampOn ? [0, -2, 2, -1, 1, 0] : 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >

        <img
          src={lampOn ? lampOnImg : lampOffImg}
          alt="Standing Lamp"
          className={`lamp ${lampOn ? "on" : ""}`}
          onClick={toggleLamp}
        />
        <AnimatePresence>

          {lampOn && (
            <motion.div
              className="light-cone"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
              }}
            />
          )}

        </AnimatePresence>

      </motion.div>

      {/* Register Card */}

      <AnimatePresence>

        {lampOn && (

          <motion.form
            className="login-card register-card"
            onSubmit={handleSubmit}
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.92,
            }}
            transition={{
              duration: 0.45,
            }}
          >

            <span className="welcome-tag">
              GET STARTED
            </span>

            <h2>
              Sign Up
            </h2>

            <p className="subtitle">
              Turn on the light,
              create your account.
            </p>

            {success && (
              <div className="error-box" style={{ background: "#22c55e22", color: "#c7f7d4", borderColor: "rgba(34,197,94,.35)" }}>
                Account created - redirecting to login...
              </div>
            )}

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            {!success && (
              <>
                <div className="input-box">

                  <FiUser className="input-icon" />

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="input-box">

                  <FiMail className="input-icon" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="input-box">

                  <FiLock className="input-icon" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >

                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}

                  </button>

                </div>

                <div className="input-box" style={{ marginBottom: 25 }}>

                  <FiLock className="input-icon" />

                  <input
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                      setShowConfirm(
                        !showConfirm
                      )
                    }
                  >

                    {showConfirm ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}

                  </button>

                </div>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="login-btn"
                  type="submit"
                  disabled={loading}
                >

                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Sign Up

                      <FiArrowRight />

                    </>
                  )}

                </motion.button>

                <p className="register-text">

                  Already have an account?

                  <button
                    type="button"
                    className="register-btn"
                    onClick={() => navigate("/")}
                  >
                    Log In
                  </button>

                </p>
              </>
            )}

          </motion.form>

        )}

      </AnimatePresence>

      {!lampOn && (

        <motion.div
          className="lamp-message"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >

          <h3>
            Click the lamp to begin
          </h3>

          <p>
            Turn on the light to reveal
            your Smart Drive sign up.
          </p>

        </motion.div>

      )}

    </div>
  );
}

export default Register;