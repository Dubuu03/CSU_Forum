import React, { useState } from "react";
import { ChevronLeft, Search, CircleUserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/Header.module.css";
import { useNavigate } from "react-router-dom";

const Header = ({ onOpenProfileSidebar }) => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const toggleSearch = () => setIsSearchOpen((prev) => !prev);
    return (
        <header className={styles.header}>
            <div className={styles.pageInfo}>
                <ChevronLeft color="#f1f1f1" size={28} onClick={() => navigate(-1)} />
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
                            animate={{ width: "210px", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={styles.searchInput}
                        />
                    ) : null}
                </AnimatePresence>
            </div>
            <div className={styles.rightIcons}>
                <Search color="#f1f1f1" onClick={toggleSearch} style={{ cursor: "pointer" }} />
                <button className={styles.profileButton} onClick={onOpenProfileSidebar}>
                    <CircleUserRound color="#f1f1f1" />
                </button>
            </div>
        </header>
    );
};

export default Header;
