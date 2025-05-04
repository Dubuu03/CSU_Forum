import React from "react";
import styles from "../styles/NavBar.module.css";
import { CirclePlus, House, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();

    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <House
                        color="#fff"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/home")}
                    />
                </li>
                <li>
                    <CirclePlus
                        color="#fff"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/discussion")}
                    />
                </li>
                <li>
                    <Users
                        color="#fff"
                        fill="#fff"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/communities")}
                    />
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
