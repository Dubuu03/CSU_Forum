import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
    const [formData, setFormData] = useState({ id: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await authService.login(formData);
            if (data.access_token) {
                localStorage.setItem("accessToken", data.access_token);
                alert("Login successful!");
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2 >Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="id"
                    placeholder="User ID"
                    value={formData.id}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
