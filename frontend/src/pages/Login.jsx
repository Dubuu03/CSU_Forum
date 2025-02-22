import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import authService, { AuthenticationError } from "../services/authService";
import useTogglePassword from "../hooks/Auth/useTogglePassword";
import "../styles/login.css";
import gate from "../assets/gate.jpg";
import logo from "../assets/csulogo.png";
import logov3 from "../assets/logov3.png";
import eagle from "../assets/eagle.png";
import BtnBack from "../components/BtnBack";


const Login = () => {
    const [formData, setFormData] = useState({ id: "", password: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { showPassword, togglePasswordVisibility } = useTogglePassword();

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const data = await authService.login(formData);

            if (data.access_token) {
                localStorage.setItem("accessToken", data.access_token);
                setSuccess("Login successful!");
                navigate("/dashboard");
            }
        } catch (err) {
            if (err instanceof AuthenticationError) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        }
    };




    return (
        <div className="login">
            <div className="head">
                <BtnBack />

                <h2 className="head-title">
                    <span className="csu-red">CSU</span>
                    <span className="csu-yellow">nite</span>
                </h2>
                <p className="description">Cagayan State University - Carig Campus</p>
                <hr className="divider" />
            </div>

            <div className="form-container">
                <div className="logo-container">
                    <img src={logov3} alt="CSU Logo" className="logo" />
                    <img src={eagle} alt="Eagle" className="eagle" />
                </div>

                <h2 className="title">Welcome, Agila!</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="id" className="form-label">Student ID:</label>
                    <input
                        className="form-input"
                        type="text"
                        name="id"
                        placeholder="Enter Student ID"
                        value={formData.id}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="password" className="form-label">Password:</label>
                    <div className="password-input-container">
                        <input
                            className="form-input"
                            value={formData.password}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter Password"
                            onChange={handleChange}
                            required
                        />
                        <div className="password-toggle-icon" onClick={togglePasswordVisibility}>
                            {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <div className="button-container">
                        <button
                            type="submit"
                            className={`btnSubmit ${error || success ? "adjust-margin" : ""}`}>
                            Login
                        </button>
                    </div>
                </form>

            </div>

            <div className="gate-container">
                <img src={gate} alt="University Gate" className="gate" />
            </div>
        </div>
    );
};

export default Login;