// import api from "./api";

// // Login API
// export const loginUser = async (email, password) => {
//   try {

//     const response = await api.post("/auth/login", {
//       email,
//       password,
//     });

//     return response.data;

//   } catch (error) {

//     throw (
//       error.response?.data || {
//         success: false,
//         message: "Login failed",
//       }
//     );

//   }
// };

// // Register API
// export const registerUser = async (username, email, password) => {
//   try {

//     const response = await api.post("/auth/register", {
//       username,
//       email,
//       password,
//     });

//     return response.data;

//   } catch (error) {

//     throw (
//       error.response?.data || {
//         success: false,
//         message: "Registration failed",
//       }
//     );

//   }
// };

import api from "./api";

// Login API
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

// Register API
export const registerUser = async (username, email, password) => {
  try {

    const response = await api.post("/auth/register", {
      name: username, // backend's authController expects "name", not "username"
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