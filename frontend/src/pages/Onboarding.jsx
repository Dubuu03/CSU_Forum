import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Onboarding.module.css';
import csunite from '../assets/logov3.png';
import projName from '../assets/proj-name.png';
import gate from '../assets/gate.jpg';

const Onboarding = () => {

    return (
        <div className={styles.mainContainer}>
            <div className={styles.topSection}>
                <img className={styles.csuniteLogo} src={csunite} alt="csunite" />
                <div className={styles.titleSection}>
                    <img className={styles.title} src={projName} alt="project-name" />
                    <p className={styles.subtitle}>Cagayan State University - Carig Campus</p>
                </div>
                <Link to="/login" style={{ textDecoration: "none" }}>
                    <div className={styles.button}>Get Started</div>
                </Link>
            </div>
            <div className={styles.bottomSection}>
                <img className={styles.bottomBackground} src={gate} alt="gate" />
            </div>
        </div>

    );
};

export default Onboarding;