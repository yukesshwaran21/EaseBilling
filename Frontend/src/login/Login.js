// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
// import { auth, googleProvider } from "./firebaseConfig";
// import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
// import "./Login.css"

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       console.log("User signed in:", result.user);
//       navigate("/Admin");
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//     }
//   };

  

//   const handleForgotPassword = async () => {
//     if (!email) {
//       alert("Please enter your email first.");
//       return;
//     }
//     try {
//       await sendPasswordResetEmail(auth, email);
//       alert("Password reset email sent!");
//     } catch (error) {
//       console.error("Error sending password reset email:", error.message);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("https://easebilling.onrender.com/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });
  
//       const data = await response.json();
//       console.log("Response Data:", data);
  
//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify({
//           email: data.email,
//           role: data.role
//         }));
//         console.log("Email:", data.email);
  
//         const userRole = (data.role || "").toLowerCase();
//         if (userRole === "admin") {
//           navigate("/Admin");
//         } else if (userRole === "cashier") {
//           navigate("/Cashier");
//         } else if (userRole === "labour") {
//           navigate("/Pharmacist", { state: { email: email } });
//         }
//         console.log("Login Successful");
//       } else {
//         alert(data.error || "Login failed. Please check your credentials.");
//       }
//     } catch (error) {
//       console.error("Login Error:", error);
//       alert("Login failed. Please check your connection and try again.");
//     }
//   };
  
  
//   return (
//     <div className="login-page">
//       <div className="login-box">
//         <h2>Login</h2>
//         <form onSubmit={handleLogin}>
//           {/* Email Input */}
//           <div className="login-input-container">
//             <FaEnvelope className="login-icon" />
//             <input
//               type="email"
//               className="login-input"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password Input */}
//           <div className="login-input-container">
//             <FaLock className="login-icon" />
//             <input
//               type="password"
//               className="login-input"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {/* Login Button */}
//           <button type="submit" className="login-btn">Login</button>
//         </form>

//         {/* Google Login */}
//         {/* <button className="google-login-btn" onClick={handleGoogleSignIn}>
//           <FaGoogle className="google-icon" /> Sign in with Google
//         </button> */}

//         {/* Forgot Password */}
//         {/* <button className="forgot-password-btn" onClick={handleForgotPassword}>
//           Forgot Password? 
//         </button> */}
//       </div>
//     </div>
//   );
// };

// export default Login;

































"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "./firebaseConfig"
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      alert("Password reset email sent!")
    } catch (error) {
      console.error("Error sending password reset email:", error.message)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("https://easebilling.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Response Data:", data)

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            role: data.role,
          }),
        )
        console.log("Email:", data.email)

        const userRole = (data.role || "").toLowerCase()
        if (userRole === "admin") {
          navigate("/Admin")
        } else if (userRole === "cashier") {
          navigate("/Cashier")
        } else if (userRole === "labour") {
          navigate("/Pharmacist", { state: { email: email } })
        }
        console.log("Login Successful")
      } else {
        alert(data.error || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login Error:", error)
      alert("Login failed. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content">
          <div className="auth-header">
            <div className="logo-container">
              <div className="logo">EB</div>
            </div>
            <h1>Welcome to EaseBilling</h1>
            <p>Please sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-field">
              <div className="input-group">
                <FaEnvelope className="field-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <div className="input-group">
                <FaLock className="field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="forgot-password-link">
              <span onClick={handleForgotPassword}>Forgot password?</span>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? "loading" : ""}`} 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loader-container">
                  <div className="loader"></div>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        
        <div className="auth-background">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
    </div>
  )
}

export default Login
