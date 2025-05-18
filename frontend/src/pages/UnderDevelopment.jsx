import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; // Optional: Install lucide-react if not already

const UnderDevelopment = () => {
    const navigate = useNavigate();

    const containerStyle = {
        textAlign: "center",
        background: "linear-gradient(to bottom, #ffffff, #f4f4f4)",
        color: "#b30000",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
    };

    const rocketStyle = {
        marginBottom: "2rem",
        animation: "float 2s ease-in-out infinite",
    };

    const keyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;

    const headingStyle = {
        fontSize: "1.6rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        color: "#b30000",
    };

    const paragraphStyle = {
        fontSize: "0.95rem",
        marginBottom: "2rem",
        color: "#b30000",
    };

    const buttonStyle = {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.6rem 1.2rem",
        fontSize: "0.9rem",
        borderRadius: "30px",
        border: "none",
        backgroundColor: "#b30000",
        color: "#fff",
        cursor: "pointer",
        transition: "0.3s ease",
    };

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                <div style={rocketStyle}>
                    <svg viewBox="0 0 64 64" width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 2C32 2 48 18 48 34C48 50 32 62 32 62C32 62 16 50 16 34C16 18 32 2 32 2Z" fill="#FF5722" />
                        <circle cx="32" cy="22" r="4" fill="#fff" />
                        <path d="M30 45H34V55H30V45Z" fill="#FF5722" />
                        <path d="M28 55H36V60H28V55Z" fill="#E64A19" />
                    </svg>
                </div>
                <h1 style={headingStyle}>Sorry, we're doing some work on the site</h1>
                <p style={paragraphStyle}>
                    Thank you for being patient. We are working hard and will be back shortly.
                </p>
                <button style={buttonStyle} onClick={() => navigate("/home")}>
                    <ChevronLeft size={20} /> Back to Home
                </button>
            </div>
        </>
    );
};

export default UnderDevelopment;
