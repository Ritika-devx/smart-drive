// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {

//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [token, setToken] = useState(
//     localStorage.getItem("token") || null
//   );

//   useEffect(() => {

//     if (token) {
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("token");
//     }

//   }, [token]);

//   useEffect(() => {

//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }

//   }, [user]);

//   const login = (jwtToken, userData) => {

//     setToken(jwtToken);
//     setUser(userData);

//   };

//   const logout = () => {

//     setToken(null);
//     setUser(null);

//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         login,
//         logout,
//         isAuthenticated: !!token
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );

// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  // ==========================================
  // GET SAVED TOKEN
  // ==========================================

  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      null
    );
  });


  // ==========================================
  // GET SAVED USER
  // ==========================================

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      return null;
    }
  });


  // ==========================================
  // LOGIN
  // ==========================================

  const login = (jwtToken, userData, rememberMe = false) => {

    // Update React state
    setToken(jwtToken);
    setUser(userData);


    // Remove any previous login data
    // from both storage locations

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");


    // ==========================================
    // REMEMBER ME
    // ==========================================

    if (rememberMe) {

      // Remember Me checked
      // Keep login after browser is closed

      localStorage.setItem("token", jwtToken);

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

    } else {

      // Remember Me unchecked
      // Keep login only for current session

      sessionStorage.setItem("token", jwtToken);

      sessionStorage.setItem(
        "user",
        JSON.stringify(userData)
      );
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    // Clear React state
    setToken(null);
    setUser(null);


    // Clear persistent login
    localStorage.removeItem("token");
    localStorage.removeItem("user");


    // Clear session login
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };


  // ==========================================
  // AUTH CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ==========================================
// CUSTOM AUTH HOOK
// ==========================================

export function useAuth() {
  return useContext(AuthContext);
}