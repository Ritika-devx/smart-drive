// // import { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useNavigate } from "react-router-dom";
// // import lampOffImg from "../assets/lamp-off.png";
// // import lampOnImg from "../assets/lamp-on.png";
// // import {
// //   FiMail,
// //   FiLock,
// //   FiEye,
// //   FiEyeOff,
// //   FiArrowRight,
// // } from "react-icons/fi";

// // import "./Login.css";

// // import { loginUser } from "../services/authService";
// // import { useAuth } from "../context/AuthContext";

// // function Login() {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();

// //   const [lampOn, setLampOn] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);

// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const toggleLamp = () => {
// //     setLampOn((prev) => !prev);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const data = await loginUser(
// //         formData.email,
// //         formData.password
// //       );

// //       login(data.token, data.user);

// //       navigate("/dashboard");
// //     } catch (err) {
// //       setError(err.message || "Login failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className={`login-page ${lampOn ? "lamp-on" : ""}`}>

// //       {/* Background */}

// //       <div className="background-gradient"></div>
// //       <div className="background-grid"></div>

// //       {/* Brand */}

// //       <motion.div
// //         className="brand"
// //         initial={{ opacity: 0, y: -25 }}
// //         animate={{ opacity: 1, y: 0 }}
// //       >
// //         <h1>Smart Drive</h1>
// //         <p>
// //           Intelligent Cloud Storage
// //         </p>
// //       </motion.div>

// //       {/* Left Content */}

// //       <motion.div
// //         className="hero-section"
// //         initial={{ opacity: 0, x: -80 }}
// //         animate={{ opacity: 1, x: 0 }}
// //         transition={{ duration: 0.8 }}
// //       >

// //         <h2>
// //           Store smarter.
// //           <br />
// //           Access faster.
// //         </h2>

// //         <p>
// //           Organize your files with
// //           AI-powered suggestions,
// //           duplicate detection,
// //           analytics and secure storage.
// //         </p>

// //         {/* <div className="feature-list">

// //           <div className="feature">
// //             <span>📁</span>
// //             <p>Secure File Upload</p>
// //           </div>

// //           <div className="feature">
// //             <span>⚡</span>
// //             <p>Smart Suggestions</p>
// //           </div>

// //           <div className="feature">
// //             <span>📊</span>
// //             <p>Storage Analytics</p>
// //           </div>

// //           <div className="feature">
// //             <span>☁️</span>
// //             <p>Cloud Storage</p>
// //           </div>

// //         </div> */}

// //       </motion.div>

// //       {/* Standing Lamp */}

// //       <motion.div
// //         className="lamp-container"
// //         animate={{
// //           rotate: lampOn ? [0, -2, 2, -1, 1, 0] : 0,
// //         }}
// //         transition={{
// //           duration: 0.6,
// //         }}
// //       >

// //         <img
// //   src={lampOn ? lampOnImg : lampOffImg}
// //   alt="Standing Lamp"
// //   className={`lamp ${lampOn ? "on" : ""}`}
// //   onClick={toggleLamp}
// // />
// //         <AnimatePresence>

// //           {lampOn && (
// //             <motion.div
// //               className="light-cone"
// //               initial={{
// //                 opacity: 0,
// //               }}
// //               animate={{
// //                 opacity: 1,
// //               }}
// //               exit={{
// //                 opacity: 0,
// //               }}
// //               transition={{
// //                 duration: 0.5,
// //               }}
// //             />
// //           )}

// //         </AnimatePresence>

// //       </motion.div>

// //       {/* Login Card */}

// //       <AnimatePresence>

// //         {lampOn && (

// //           <motion.form
// //             className="login-card"
// //             onSubmit={handleSubmit}
// //             initial={{
// //               opacity: 0,
// //               y: 50,
// //               scale: 0.92,
// //             }}
// //             animate={{
// //               opacity: 1,
// //               y: 0,
// //               scale: 1,
// //             }}
// //             exit={{
// //               opacity: 0,
// //               y: 40,
// //               scale: 0.92,
// //             }}
// //             transition={{
// //               duration: 0.45,
// //             }}
// //           >

// //             <span className="welcome-tag">
// //               WELCOME BACK
// //             </span>

// //             <h2>
// //               Sign In
// //             </h2>

// //             <p className="subtitle">
// //               Turn on the light,
// //               unlock Smart Drive.
// //             </p>

// //             {error && (
// //               <div className="error-box">
// //                 {error}
// //               </div>
// //             )}

// //             <div className="input-box">

// //               <FiMail className="input-icon" />

// //               <input
// //                 type="email"
// //                 name="email"
// //                 placeholder="Email Address"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 required
// //               />

// //             </div>

// //             <div className="input-box">

// //               <FiLock className="input-icon" />

// //               <input
// //                 type={
// //                   showPassword
// //                     ? "text"
// //                     : "password"
// //                 }
// //                 name="password"
// //                 placeholder="Password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 required
// //               />

// //               <button
// //                 type="button"
// //                 className="eye-btn"
// //                 onClick={() =>
// //                   setShowPassword(
// //                     !showPassword
// //                   )
// //                 }
// //               >

// //                 {showPassword ? (
// //                   <FiEyeOff />
// //                 ) : (
// //                   <FiEye />
// //                 )}

// //               </button>

// //             </div>
// //                         <div className="login-options">

// //               <label className="remember-me">

// //                 <input type="checkbox" />

// //                 <span>
// //                   Remember Me
// //                 </span>

// //               </label>

// //               <button
// //                 type="button"
// //                 className="forgot-password"
// //               >
// //                 Forgot Password?
// //               </button>

// //             </div>

// //             <motion.button
// //               whileHover={{
// //                 scale: 1.03,
// //               }}
// //               whileTap={{
// //                 scale: 0.97,
// //               }}
// //               className="login-btn"
// //               type="submit"
// //               disabled={loading}
// //             >

// //               {loading ? (
// //                 "Signing In..."
// //               ) : (
// //                 <>
// //                   Login

// //                   <FiArrowRight />

// //                 </>
// //               )}

// //             </motion.button>

// //             <div className="divider">

// //               <span>
// //                 OR
// //               </span>

// //             </div>

// //             {/* <button
// //               type="button"
// //               className="google-btn"
// //             >

// //               <img
// //                 src="https://www.svgrepo.com/show/475656/google-color.svg"
// //                 alt="Google"
// //               />

// //               Continue with Google

// //             </button> */}

// //             <p className="register-text">

// //               Don't have an account?

// //               <button
// //                 type="button"
// //                 className="register-btn"
// //               >
// //                 Create Account
// //               </button>

// //             </p>

// //           </motion.form>

// //         )}

// //       </AnimatePresence>

// //       {!lampOn && (

// //         <motion.div
// //           className="lamp-message"
// //           initial={{
// //             opacity: 0,
// //           }}
// //           animate={{
// //             opacity: 1,
// //           }}
// //           exit={{
// //             opacity: 0,
// //           }}
// //         >

// //           <h3>
// //             Click the lamp to begin ✨
// //           </h3>

// //           <p>
// //             Turn on the light to reveal
// //             your Smart Drive login.
// //           </p>

// //         </motion.div>

// //       )}

// //     </div>
// //   );
// // }

// // export default Login;


// // import { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useNavigate } from "react-router-dom";
// // import lampOffImg from "../assets/lamp-off.png";
// // import lampOnImg from "../assets/lamp-on.png";
// // import {
// //   FiMail,
// //   FiLock,
// //   FiEye,
// //   FiEyeOff,
// //   FiArrowRight,
// // } from "react-icons/fi";

// // import "../styles/Login.css";

// // import { loginUser } from "../services/authService";
// // import { useAuth } from "../context/AuthContext";

// // function Login() {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();

// //   const [lampOn, setLampOn] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);

// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const toggleLamp = () => {
// //     setLampOn((prev) => !prev);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const data = await loginUser(
// //         formData.email,
// //         formData.password
// //       );

// //       login(data.token, data.user);

// //       navigate("/dashboard");
// //     } catch (err) {
// //       setError(err.message || "Login failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className={`login-page ${lampOn ? "lamp-on" : ""}`}>

// //       {/* Background */}

// //       <div className="background-gradient"></div>
// //       <div className="background-grid"></div>

// //       {/* Brand */}

// //       <motion.div
// //         className="brand"
// //         initial={{ opacity: 0, y: -25 }}
// //         animate={{ opacity: 1, y: 0 }}
// //       >
// //         <h1>Smart Drive</h1>
// //         <p>
// //           Intelligent Cloud Storage
// //         </p>
// //       </motion.div>

// //       {/* Left Content */}

// //       <motion.div
// //         className="hero-section"
// //         initial={{ opacity: 0, x: -80 }}
// //         animate={{ opacity: 1, x: 0 }}
// //         transition={{ duration: 0.8 }}
// //       >

// //         <h2>
// //           Store smarter.
// //           <br />
// //           Access faster.
// //         </h2>

// //         <p>
// //           Organize your files with
// //           AI-powered suggestions,
// //           duplicate detection,
// //           analytics and secure storage.
// //         </p>

// //         {/* <div className="feature-list">

// //           <div className="feature">
// //             <span>📁</span>
// //             <p>Secure File Upload</p>
// //           </div>

// //           <div className="feature">
// //             <span>⚡</span>
// //             <p>Smart Suggestions</p>
// //           </div>

// //           <div className="feature">
// //             <span>📊</span>
// //             <p>Storage Analytics</p>
// //           </div>

// //           <div className="feature">
// //             <span>☁️</span>
// //             <p>Cloud Storage</p>
// //           </div>

// //         </div> */}

// //       </motion.div>

// //       {/* Standing Lamp */}

// //       <motion.div
// //         className="lamp-container"
// //         animate={{
// //           rotate: lampOn ? [0, -2, 2, -1, 1, 0] : 0,
// //         }}
// //         transition={{
// //           duration: 0.6,
// //         }}
// //       >

// //         <img
// //   src={lampOn ? lampOnImg : lampOffImg}
// //   alt="Standing Lamp"
// //   className={`lamp ${lampOn ? "on" : ""}`}
// //   onClick={toggleLamp}
// // />
// //         <AnimatePresence>

// //           {lampOn && (
// //             <motion.div
// //               className="light-cone"
// //               initial={{
// //                 opacity: 0,
// //               }}
// //               animate={{
// //                 opacity: 1,
// //               }}
// //               exit={{
// //                 opacity: 0,
// //               }}
// //               transition={{
// //                 duration: 0.5,
// //               }}
// //             />
// //           )}

// //         </AnimatePresence>

// //       </motion.div>

// //       {/* Login Card */}

// //       <AnimatePresence>

// //         {lampOn && (

// //           <motion.form
// //             className="login-card"
// //             onSubmit={handleSubmit}
// //             initial={{
// //               opacity: 0,
// //               y: 50,
// //               scale: 0.92,
// //             }}
// //             animate={{
// //               opacity: 1,
// //               y: 0,
// //               scale: 1,
// //             }}
// //             exit={{
// //               opacity: 0,
// //               y: 40,
// //               scale: 0.92,
// //             }}
// //             transition={{
// //               duration: 0.45,
// //             }}
// //           >

// //             <span className="welcome-tag">
// //               WELCOME BACK
// //             </span>

// //             <h2>
// //               Sign In
// //             </h2>

// //             <p className="subtitle">
// //               Turn on the light,
// //               unlock Smart Drive.
// //             </p>

// //             {error && (
// //               <div className="error-box">
// //                 {error}
// //               </div>
// //             )}

// //             <div className="input-box">

// //               <FiMail className="input-icon" />

// //               <input
// //                 type="email"
// //                 name="email"
// //                 placeholder="Email Address"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 required
// //               />

// //             </div>

// //             <div className="input-box">

// //               <FiLock className="input-icon" />

// //               <input
// //                 type={
// //                   showPassword
// //                     ? "text"
// //                     : "password"
// //                 }
// //                 name="password"
// //                 placeholder="Password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 required
// //               />

// //               <button
// //                 type="button"
// //                 className="eye-btn"
// //                 onClick={() =>
// //                   setShowPassword(
// //                     !showPassword
// //                   )
// //                 }
// //               >

// //                 {showPassword ? (
// //                   <FiEyeOff />
// //                 ) : (
// //                   <FiEye />
// //                 )}

// //               </button>

// //             </div>
// //                         <div className="login-options">

// //               <label className="remember-me">

// //                 <input type="checkbox" />

// //                 <span>
// //                   Remember Me
// //                 </span>

// //               </label>

// //               <button
// //                 type="button"
// //                 className="forgot-password"
// //               >
// //                 Forgot Password?
// //               </button>

// //             </div>

// //             <motion.button
// //               whileHover={{
// //                 scale: 1.03,
// //               }}
// //               whileTap={{
// //                 scale: 0.97,
// //               }}
// //               className="login-btn"
// //               type="submit"
// //               disabled={loading}
// //             >

// //               {loading ? (
// //                 "Signing In..."
// //               ) : (
// //                 <>
// //                   Login

// //                   <FiArrowRight />

// //                 </>
// //               )}

// //             </motion.button>

// //             <div className="divider">

// //               <span>
// //                 OR
// //               </span>

// //             </div>

// //             {/* <button
// //               type="button"
// //               className="google-btn"
// //             >

// //               <img
// //                 src="https://www.svgrepo.com/show/475656/google-color.svg"
// //                 alt="Google"
// //               />

// //               Continue with Google

// //             </button> */}

// //             <p className="register-text">

// //               Don't have an account?

// //               <button
// //                 type="button"
// //                 className="register-btn"
// //                 onClick={() => navigate("/register")}
// //               >
// //                 Create Account
// //               </button>

// //             </p>

// //           </motion.form>

// //         )}

// //       </AnimatePresence>

// //       {!lampOn && (

// //         <motion.div
// //           className="lamp-message"
// //           initial={{
// //             opacity: 0,
// //           }}
// //           animate={{
// //             opacity: 1,
// //           }}
// //           exit={{
// //             opacity: 0,
// //           }}
// //         >

// //           <h3>
// //             Click the lamp to begin ✨
// //           </h3>

// //           <p>
// //             Turn on the light to reveal
// //             your Smart Drive login.
// //           </p>

// //         </motion.div>

// //       )}

// //     </div>
// //   );
// // }

// // export default Login;

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import lampOffImg from "../assets/lamp-off.png";
// import lampOnImg from "../assets/lamp-on.png";
// import {
//   FiMail,
//   FiLock,
//   FiEye,
//   FiEyeOff,
//   FiArrowRight,
// } from "react-icons/fi";

// import "../styles/Login.css";

// import { loginUser } from "../services/authService";
// import { useAuth } from "../context/AuthContext";

// function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [lampOn, setLampOn] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Remember Me state
//   const [rememberMe, setRememberMe] = useState(false);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const toggleLamp = () => {
//     setLampOn((prev) => !prev);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setError("");

//     try {
//       const data = await loginUser(
//         formData.email,
//         formData.password
//       );

//       // Pass Remember Me choice to AuthContext
//       login(data.token, data.user, rememberMe);

//       navigate("/dashboard");

//     } catch (err) {
//       setError(err.message || "Login failed");

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={`login-page ${lampOn ? "lamp-on" : ""}`}>

//       {/* Background */}

//       <div className="background-gradient"></div>
//       <div className="background-grid"></div>


//       {/* Brand */}

//       <motion.div
//         className="brand"
//         initial={{ opacity: 0, y: -25 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <h1>Smart Drive</h1>

//         <p>
//           Intelligent Cloud Storage
//         </p>
//       </motion.div>


//       {/* Left Content */}

//       <motion.div
//         className="hero-section"
//         initial={{ opacity: 0, x: -80 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.8 }}
//       >

//         <h2>
//           Store smarter.
//           <br />
//           Access faster.
//         </h2>

//         <p>
//           Organize your files with
//           AI-powered suggestions,
//           duplicate detection,
//           analytics and secure storage.
//         </p>

//         {/* <div className="feature-list">

//           <div className="feature">
//             <span>📁</span>
//             <p>Secure File Upload</p>
//           </div>

//           <div className="feature">
//             <span>⚡</span>
//             <p>Smart Suggestions</p>
//           </div>

//           <div className="feature">
//             <span>📊</span>
//             <p>Storage Analytics</p>
//           </div>

//           <div className="feature">
//             <span>☁️</span>
//             <p>Cloud Storage</p>
//           </div>

//         </div> */}

//       </motion.div>


//       {/* Standing Lamp */}

//       <motion.div
//         className="lamp-container"
//         animate={{
//           rotate: lampOn ? [0, -2, 2, -1, 1, 0] : 0,
//         }}
//         transition={{
//           duration: 0.6,
//         }}
//       >

//         <img
//           src={lampOn ? lampOnImg : lampOffImg}
//           alt="Standing Lamp"
//           className={`lamp ${lampOn ? "on" : ""}`}
//           onClick={toggleLamp}
//         />

//         <AnimatePresence>

//           {lampOn && (
//             <motion.div
//               className="light-cone"
//               initial={{
//                 opacity: 0,
//               }}
//               animate={{
//                 opacity: 1,
//               }}
//               exit={{
//                 opacity: 0,
//               }}
//               transition={{
//                 duration: 0.5,
//               }}
//             />
//           )}

//         </AnimatePresence>

//       </motion.div>


//       {/* Login Card */}

//       <AnimatePresence>

//         {lampOn && (

//           <motion.form
//             className="login-card"
//             onSubmit={handleSubmit}
//             initial={{
//               opacity: 0,
//               y: 50,
//               scale: 0.92,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//               scale: 1,
//             }}
//             exit={{
//               opacity: 0,
//               y: 40,
//               scale: 0.92,
//             }}
//             transition={{
//               duration: 0.45,
//             }}
//           >

//             <span className="welcome-tag">
//               WELCOME BACK
//             </span>

//             <h2>
//               Sign In
//             </h2>

//             <p className="subtitle">
//               Turn on the light,
//               unlock Smart Drive.
//             </p>


//             {error && (
//               <div className="error-box">
//                 {error}
//               </div>
//             )}


//             <div className="input-box">

//               <FiMail className="input-icon" />

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />

//             </div>


//             <div className="input-box">

//               <FiLock className="input-icon" />

//               <input
//                 type={
//                   showPassword
//                     ? "text"
//                     : "password"
//                 }
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />

//               <button
//                 type="button"
//                 className="eye-btn"
//                 onClick={() =>
//                   setShowPassword(
//                     !showPassword
//                   )
//                 }
//               >

//                 {showPassword ? (
//                   <FiEyeOff />
//                 ) : (
//                   <FiEye />
//                 )}

//               </button>

//             </div>


//             {/* Login Options */}

//             <div className="login-options">

//               <label className="remember-me">

//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) =>
//                     setRememberMe(e.target.checked)
//                   }
//                 />

//                 <span>
//                   Remember Me
//                 </span>

//               </label>


//              <button
//   type="button"
//   className="forgot-password"
//   onClick={() => navigate("/forgot-password")}
// >
//   Forgot Password?
// </button>

//             </div>


//             {/* Login Button */}

//             <motion.button
//               whileHover={{
//                 scale: 1.03,
//               }}
//               whileTap={{
//                 scale: 0.97,
//               }}
//               className="login-btn"
//               type="submit"
//               disabled={loading}
//             >

//               {loading ? (
//                 "Signing In..."
//               ) : (
//                 <>
//                   Login

//                   <FiArrowRight />

//                 </>
//               )}

//             </motion.button>


//             <div className="divider">

//               <span>
//                 OR
//               </span>

//             </div>


//             {/* Google Login - currently disabled */}

//             {/* <button
//               type="button"
//               className="google-btn"
//             >

//               <img
//                 src="https://www.svgrepo.com/show/475656/google-color.svg"
//                 alt="Google"
//               />

//               Continue with Google

//             </button> */}


//             {/* Register */}

//             <p className="register-text">

//               Don't have an account?

//               <button
//                 type="button"
//                 className="register-btn"
//                 onClick={() => navigate("/register")}
//               >
//                 Create Account
//               </button>

//             </p>

//           </motion.form>

//         )}

//       </AnimatePresence>


//       {/* Lamp Message */}

//       {!lampOn && (

//         <motion.div
//           className="lamp-message"
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: 1,
//           }}
//           exit={{
//             opacity: 0,
//           }}
//         >

//           <h3>
//             Click the lamp to begin ✨
//           </h3>

//           <p>
//             Turn on the light to reveal
//             your Smart Drive login.
//           </p>

//         </motion.div>

//       )}

//     </div>
//   );
// }

// export default Login;
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import lampOffImg from "../assets/lamp-off.png";
import lampOnImg from "../assets/lamp-on.png";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

import "../styles/Login.css";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [lampOn, setLampOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Remember Me state
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load previously remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
      }));

      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleLamp = () => {
    setLampOn((prev) => !prev);
  };

  const handleRememberMeChange = (e) => {
    const checked = e.target.checked;

    setRememberMe(checked);

    // If user unchecks Remember Me,
    // remove the previously remembered email.
    if (!checked) {
      localStorage.removeItem("rememberedEmail");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await loginUser(
        formData.email,
        formData.password
      );

      // Remember email only
      if (rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          formData.email
        );
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Save authentication data according to Remember Me
      login(
        data.token,
        data.user,
        rememberMe
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${lampOn ? "lamp-on" : ""}`}>

      {/* ===========================
          BACKGROUND
      ============================ */}

      <div className="background-gradient"></div>
      <div className="background-grid"></div>

      {/* ===========================
          BRAND
      ============================ */}

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

      {/* ===========================
          LEFT CONTENT
      ============================ */}

      <motion.div
        className="hero-section"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>
          Store smarter.
          <br />
          Access faster.
        </h2>

        <p>
          Organize your files with
          AI-powered suggestions,
          duplicate detection,
          analytics and secure storage.
        </p>
      </motion.div>

      {/* ===========================
          STANDING LAMP
      ============================ */}

      <motion.div
        className="lamp-container"
        animate={{
          rotate: lampOn
            ? [0, -2, 2, -1, 1, 0]
            : 0,
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

      {/* ===========================
          LOGIN CARD
      ============================ */}

      <AnimatePresence>
        {lampOn && (
          <motion.form
            className="login-card"
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
              WELCOME BACK
            </span>

            <h2>
              Sign In
            </h2>

            <p className="subtitle">
              Turn on the light,
              unlock Smart Drive.
            </p>

            {/* Error */}
            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            {/* ===========================
                EMAIL
            ============================ */}

            <div className="input-box">
              <FiMail className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* ===========================
                PASSWORD
            ============================ */}

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
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>

            {/* ===========================
                LOGIN OPTIONS
            ============================ */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />

                <span>
                  Remember Me
                </span>

              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  navigate("/forgot-password")
                }
              >
                Forgot Password?
              </button>

            </div>

            {/* ===========================
                LOGIN BUTTON
            ============================ */}

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
                "Signing In..."
              ) : (
                <>
                  Login
                  <FiArrowRight />
                </>
              )}
            </motion.button>

            {/* Divider */}

            <div className="divider">
              <span>
                OR
              </span>
            </div>

            {/* ===========================
                REGISTER
            ============================ */}

            <p className="register-text">

              Don't have an account?

              <button
                type="button"
                className="register-btn"
                onClick={() =>
                  navigate("/register")
                }
              >
                Create Account
              </button>

            </p>

          </motion.form>
        )}
      </AnimatePresence>

      {/* ===========================
          LAMP MESSAGE
      ============================ */}

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
            Click the lamp to begin ✨
          </h3>

          <p>
            Turn on the light to reveal
            your Smart Drive login.
          </p>
        </motion.div>
      )}

    </div>
  );
}

export default Login;