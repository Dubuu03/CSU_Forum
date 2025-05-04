import React from "react";
import { motion } from "framer-motion";
import ProfileHeader from "./ProfileHeader";
import ProfileMenu from "./ProfileMenu";
import styles from "../../styles/Slider/ProfileSidebar.module.css";

const ProfileSidebar = ({ profile, isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      
      <motion.aside
        className={`${styles.sidebar} ${isOpen ? styles.show : ""}`}
        initial={{ x: "100%" }} // Starts off-screen on the right
        animate={{ x: isOpen ? "0%" : "100%" }} // Slides in when open
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ProfileHeader
          profileImage={profile.profileImage}
          username={profile.username}
          status={profile.status}
          onClose={onClose}
        />
        <ProfileMenu />
      </motion.aside>
    </>
  );
};

export default ProfileSidebar;
