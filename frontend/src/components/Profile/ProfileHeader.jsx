import React from "react";
import styles from "../../styles/Slider/ProfileSidebar.module.css";
import { X } from "lucide-react";

const ProfileHeader = ({ profileImage, username, status, onClose }) => {
  return (
    <div className={styles.profileHeader}>
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={24} color="#000" />
      </button>
      <div className={styles.userInfo}>
        <div className={styles.profilePicContainer}>
          <img src={profileImage} alt="Profile" className={styles.profilePic} />
        </div>
        <p className={styles.username}>{username}</p>
        <span className={`${styles.status} ${status === "Online" ? styles.online : styles.offline}`}>
          Online Status: {status === "Online" ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;