import React from "react";
import { AlignJustify, Search, CircleUserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/Header.module.css";

const Header = ({ title, logo, onOpenSidebar, onOpenProfileSidebar, keyword, setKeyword, isSearchOpen, setIsSearchOpen }) => {
    const toggleSearch = () => {
        setIsSearchOpen((prev) => !prev);
    };

    return (
        <header className={styles.header}>
            <div className={styles.pageInfo}>
                <button className={styles.menuButton} onClick={onOpenSidebar} aria-label="Open sidebar">
                    <AlignJustify />
                </button>

                <AnimatePresence mode="wait">
                    {isSearchOpen ? (
                        <motion.input
                            key="searchInput"
                            type="text"
                            autoFocus
                            placeholder="Search..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "220px", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={styles.searchInput}
                        />
                    ) : logo ? (
                        <motion.img
                            key="logo"
                            src={logo}
                            alt="Logo"
                            className={styles.logo}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    ) : (
                        <motion.span
                            key="title"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {title}
                        </motion.span>
                    )}
                </AnimatePresence>

            </div>

            <div className={styles.rightIcons}>
                <Search
                    onClick={toggleSearch}
                    style={{ cursor: "pointer" }}
                    aria-label="Toggle search"
                />
                <button
                    className={styles.profileButton}
                    onClick={onOpenProfileSidebar}
                    aria-label="Open profile sidebar"
                >
                    <CircleUserRound />
                </button>
            </div>
        </header>
    );
};

export default Header;
