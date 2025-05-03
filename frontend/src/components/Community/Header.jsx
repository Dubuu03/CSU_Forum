import React from "react";
import { ChevronLeft, Search, CircleUserRound } from "lucide-react";
import styles from "../../styles/Header.module.css";
import { useNavigate } from "react-router-dom";

const Header = ({ onOpenProfileSidebar }) => {
    const navigate = useNavigate();
    return (
        <header className={styles.header}>
            <div className={styles.pageInfo}>
                <ChevronLeft color="#f1f1f1" size={28} onClick={() => navigate(-1)} />
            </div>
            <div className={styles.rightIcons}>
                <Search color="#f1f1f1" />
                <button className={styles.profileButton} onClick={onOpenProfileSidebar}>
                    <CircleUserRound color="#f1f1f1" />
                </button>
            </div>
        </header>
    );
};

export default Header;
