import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import authService, { AuthenticationError } from "../services/authService";
import useTogglePassword from "../hooks/Auth/useTogglePassword";
import styles from "../styles/Login.module.css";
import gate from "../assets/gate.jpg";
import projName from "../assets/proj-name.png";
import csunite from '../assets/CSUnite.png';
import BtnBack from "../components/BtnBack";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const Login = () => {
    const [formData, setFormData] = useState({ id: "", password: "" });
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
    const { showPassword, togglePasswordVisibility } = useTogglePassword();
    const navigate = useNavigate();

    const showAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleAlertClose = () => {
        setAlert({ ...alert, open: false });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await authService.login(formData);

            if (data.access_token) {
                localStorage.setItem("accessToken", data.access_token);
                showAlert("Login successful!", "success");
                setTimeout(() => navigate("/home"), 500);
            }
        } catch (err) {
            if (err instanceof AuthenticationError) {
                showAlert(err.message, "error");
            } else {
                showAlert("An unexpected error occurred. Please try again later.", "error");
            }
        }
    };

    return (
        <div className={styles['main-container']}>
            <div className={styles['top-section']}>
                <div className={styles['header']}>
                    <BtnBack />
                    <div className={styles['title-section']}>
                        <img className={styles['logo']} src={projName} alt="CSUnite" />
                        <p className={styles['subtitle']}>Cagayan State University - Carig Campus</p>
                    </div>
                </div>
                <div className={styles['logo-section']}>
                    <img className={styles['csunite-logo']} src={csunite} alt="csu-logo" />
                    <p className={styles['welcome']}>Welcome, Agila!</p>
                </div>

                <form onSubmit={handleSubmit} className={styles['form-container']}>
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
                        <div className={styles['password-toggle-icon']} onClick={togglePasswordVisibility}>
                            {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                        </div>
                    </div>
                    <button className={styles['submit']} type="submit">Log In</button>
                </form>
            </div>

            <div className={styles['bottom-section']}>
                <img className={styles['bottom-background']} src={gate} alt="gate" />
            </div>

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
