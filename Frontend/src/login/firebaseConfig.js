import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5ERKASZHeyxGH-Fz7n2bXhsTFEk4ujo4",
  authDomain: "medicalconsult-fee3d.firebaseapp.com",
  projectId: "medicalconsult-fee3d",
  storageBucket: "medicalconsult-fee3d.firebasestorage.app",
  messagingSenderId: "543668670447",
  appId: "1:543668670447:web:6b42c6cec141dcfa3a701a",
  measurementId: "G-F47R8FF7SC",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
