import { useState } from "react";

const useTogglePassword = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return { showPassword, togglePasswordVisibility };
};

export default useTogglePassword;
