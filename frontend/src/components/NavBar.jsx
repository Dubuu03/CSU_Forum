import React, { useState, useEffect } from "react";
import styles from "../styles/NavBar.module.css";
import { CirclePlus } from "lucide-react";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useNavigate, useLocation } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';  // MUI Home icon

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveFromPath = (path) => {
        if (path.startsWith("/home")) return "home";
        if (path.startsWith("/discussion")) return "discussion";
        if (path.startsWith("/communities")) return "communities";
        return "";
    };

    const [active, setActive] = useState(getActiveFromPath(location.pathname));

    useEffect(() => {
        setActive(getActiveFromPath(location.pathname));
    }, [location.pathname]);

    const handleClick = (name, path) => {
        setActive(name);
        navigate(path);
    };

    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <HomeIcon
                        sx={{
                            cursor: "pointer",
                            color: active === "home" ? "#FAA307" : "#fff",
                            fontSize: 26
                        }}
                        onClick={() => handleClick("home", "/home")}
                    />
                </li>
                <li>
                    <CirclePlus
                        color={active === "discussion" ? "#FAA307" : "#fff"}
                        fill={active === "discussion" ? "#FAA307" : "none"}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("discussion", "/discussion")}
                    />
                </li>
                <li>
                    <PeopleAltIcon
                        sx={{
                            cursor: "pointer",
                            color: active === "communities" ? "#FAA307" : "#fff",
                            fontSize: 25,
                            fill: active === "communities" ? "#FAA307" : "#fff",
                        }}
                        onClick={() => handleClick("communities", "/communities")}
                    />
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
