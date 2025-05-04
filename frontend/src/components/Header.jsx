import React from "react";
import { AlignJustify, Search, CircleUserRound } from "lucide-react";
import styles from "../styles/Header.module.css";

const Header = ({ title, logo, onOpenSidebar, onOpenProfileSidebar }) => {
    return (
        <header className={styles.header}>
            <div className={styles.pageInfo}>
                <button className={styles.menuButton} onClick={onOpenSidebar}>
                    <AlignJustify />
                </button>
                {logo ? (
                    <img src={logo} alt="Logo" className={styles.logo} />
                ) : (
                    <span>{title}</span>
                )}
            </div>
            <div className={styles.rightIcons}>
                <Search />
                <button className={styles.profileButton} onClick={onOpenProfileSidebar}>
                    <CircleUserRound />
                </button>
            </div>
        </header>
    );
};

export default Header;
