import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import csunite from '../assets/CSUnite.png';
import gate from "../assets/gate.jpg";
import projName from "../assets/proj-name.png";
import BtnBack from "../components/BtnBack";
import useTogglePassword from "../hooks/Auth/useTogglePassword";
import authService, { AuthenticationError } from "../services/authService";
import styles from "../styles/Login.module.css";

// Wrapper Alert component for MUI Snackbar alerts
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const Login = () => {
    // State for login form data: username (id) and password
    const [formData, setFormData] = useState({ id: "", password: "" });

    // State for alert snackbar: open, message, and severity (info, success, error, etc.)
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    // Custom hook for toggling password visibility
    const { showPassword, togglePasswordVisibility } = useTogglePassword();

    // React Router navigate function to redirect after successful login
    const navigate = useNavigate();

    // Helper to show alert with message and severity
    const showAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    // Close alert snackbar
    const handleAlertClose = () => {
        setAlert({ ...alert, open: false });
    };

    // Update form data state when user types in inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit asynchronously
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Call login service with form data (id and password)
            const data = await authService.login(formData);

            // If login successful and access token returned
            if (data.access_token) {
                // Save access token in localStorage for future requests
                localStorage.setItem("accessToken", data.access_token);

                // Show success alert
                showAlert("Login successful!", "success");

                // Redirect to home page after short delay
                setTimeout(() => navigate("/home"), 500);
            }
        } catch (err) {
            // If the error is an authentication error (e.g., wrong credentials)
            if (err instanceof AuthenticationError) {
                showAlert(err.message, "error");
            } else {
                // For any other unexpected errors
                showAlert("An unexpected error occurred. Please try again later.", "error");
            }
        }
    };

    return (
        <div className={styles['main-container']}>
            {/* Top section containing header, logo, welcome text, and form */}
            <div className={styles['top-section']}>
                <div className={styles['header']}>
                    {/* Back button component */}
                    <BtnBack />

                    {/* Logo and subtitle */}
                    <div className={styles['title-section']}>
                        <img className={styles['logo']} src={projName} alt="CSUnite" />
                        <p className={styles['subtitle']}>Cagayan State University - Carig Campus</p>
                    </div>
                </div>

                {/* Logo section with welcome message */}
                <div className={styles['logo-section']}>
                    <img className={styles['csunite-logo']} src={csunite} alt="csu-logo" />
                    <p className={styles['welcome']}>Welcome, Agila!</p>
                </div>

                {/* Login form */}
                <form onSubmit={handleSubmit} className={styles['form-container']}>
                    {/* Username input */}
                    <div className={styles['input-group']}>
                        <label className={styles['form-label']}>Username:</label>
                        <input
                            type="text"
                            className={styles['form-input']}
                            name="id"
                            value={formData.id}
                            placeholder="Enter your username"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password input with toggle visibility */}
                    <div className={styles['input-group']}>
                        <label className={styles['form-label']}>Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={styles['form-input']}
                            name="password"
                            value={formData.password}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            required
                        />
                        {/* Eye icon to toggle password visibility */}
                        <div className={styles['password-toggle-icon']} onClick={togglePasswordVisibility}>
                            {showPassword ? (
                                <EyeOff size={20} color="#666" />
                            ) : (
                                <Eye size={20} color="#666" />
                            )}
                        </div>
                    </div>

                    {/* Submit button */}
                    <button className={styles['submit']} type="submit">Log In</button>
                </form>
            </div>

            {/* Bottom section showing a background image */}
            <div className={styles['bottom-section']}>
                <img className={styles['bottom-background']} src={gate} alt="gate" />
            </div>

            {/* Snackbar alert for messages (error, success, info) */}
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleAlertClose}
            >
                <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Login;
