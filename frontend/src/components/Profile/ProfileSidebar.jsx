import React from "react";
import { motion } from "framer-motion";
import ProfileHeader from "./ProfileHeader";
import ProfileMenu from "./ProfileMenu";
import styles from "../../styles/Slider/ProfileSidebar.module.css";

const ProfileSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <motion.aside
        className={`${styles.sidebar} ${isOpen ? styles.show : ""}`}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ProfileHeader onClose={onClose} />
        <ProfileMenu />
      </motion.aside>
    </>
  );
};

export default ProfileSidebar;
