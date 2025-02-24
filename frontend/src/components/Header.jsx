import React, { useState } from 'react';
import { AlignJustify, Search, CircleUserRound } from 'lucide-react';
import styles from '../styles/Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.pageInfo}>
                <AlignJustify />
                Communities
            </div>
            <div className={styles.rightIcons}>
                <Search />
                <CircleUserRound />
            </div>
        </header>
    );
}

export default Header;