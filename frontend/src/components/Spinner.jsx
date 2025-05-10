import React, { useEffect } from "react";

const Spinner = ({ size = 40, color = "#9d0208" }) => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
        .spinner {
            display: inline-block;
            border: 4px solid;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }`;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div
            className="spinner"
            style={{
                width: size,
                height: size,
                borderColor: `${color} transparent ${color} transparent`,
            }}
        ></div>
    );
};

export default Spinner;
