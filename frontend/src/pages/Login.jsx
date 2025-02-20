import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/login.css";
import gate from "../assets/gate.jpg";
import logo from "../assets/csulogo.png";
import eagle from "../assets/eagle.png";
import back from "../assets/back.png";


const Login = () => {
    const [formData, setFormData] = useState({ id: "", password: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
            if (err.message === "invalid_credentials") {
                setError("Invalid user credentials. Please try again.");
            } else {
                setError("An error occurred.");
            }

        }
    };

    return (
        <div className="login">
            <div className="head">
                <img
                    src={back}
                    alt="Back"
                    className="back-button"
                    onClick={() => window.history.back()}
                />
                <h2 className="head-title">
                    <span style={{ color: "#9d0208" }}>CSU</span>
                    <span style={{ color: "#FAA307" }}>nite</span>
                </h2>
                <p className="description">Cagayan State University - Carig Campus</p>
                <hr />
            </div>

            <div className="form-container">
                <div className="logo-container">
                    <img src={logo} alt="CSU Logo" className="logo" />
                    <img src={eagle} alt="Eagle" className="eagle" />
                </div>

                <h2 className="title">Welcome, Agila!</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="id">Student ID:</label>
                    <input
                        type="text"
                        name="id"
                        placeholder="Student ID"
                        value={formData.id}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <div className="button-container">
                        <button type="submit">Login</button>
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