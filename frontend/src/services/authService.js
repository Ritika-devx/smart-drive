import api from "./api";

// =======================
// LOGIN API
// =======================

export const loginUser = async (email, password) => {
  try {

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Login failed",
      }
    );

  }
};

// =======================
// REGISTER API
// =======================

export const registerUser = async (
  username,
  email,
  password
) => {
  try {

    const response = await api.post("/auth/register", {
      name: username,
      email,
      password,
    });

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Registration failed",
      }
    );

  }
};

// =======================
// FORGOT PASSWORD API
// =======================

export const forgotPassword = async (email) => {
  try {

    const response = await api.post(
      "/auth/forgot-password",
      {
        email,
      }
    );

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to process password reset request",
      }
    );

  }
};

// =======================
// RESET PASSWORD API
// =======================

export const resetPassword = async (
  token,
  newPassword
) => {
  try {

    const response = await api.post(
      "/auth/reset-password",
      {
        token,
        newPassword,
      }
    );

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to reset password",
      }
    );

  }
};