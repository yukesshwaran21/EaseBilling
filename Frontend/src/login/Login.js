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


































import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed in:", result.user);
      navigate("/Admin");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("https://easebilling.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            role: data.role,
          })
        );
        console.log("Email:", data.email);

        const userRole = (data.role || "").toLowerCase();
        if (userRole === "admin") {
          navigate("/Admin");
        } else if (userRole === "cashier") {
          navigate("/Cashier");
        } else if (userRole === "labour") {
          navigate("/Pharmacist", { state: { email: email } });
        }
        console.log("Login Successful");
      } else {
        alert(data.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="forgot-password">
            <span onClick={handleForgotPassword}>Forgot password?</span>
          </div>

          <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="google-button" onClick={handleGoogleSignIn}>
          <FaGoogle className="google-icon" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
