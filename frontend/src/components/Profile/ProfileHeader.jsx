import React from "react";
import styles from "../../styles/Slider/ProfileSidebar.module.css";
import { X } from "lucide-react";
import defaultAvatar from "../../assets/default-profile.png";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";

const ProfileHeader = ({ onClose }) => {
  const accessToken = useAuthRedirect();
  const { profile, loading, error } = useStudentProfile(accessToken);

  const FirstName = profile?.FirstName || "Guest";
  const LastName = profile?.LastName || "User";
  const profileImage = defaultAvatar;
  const status = "Online";
  const username = `${FirstName} ${LastName}`;

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
        <span
          className={`${styles.status} ${status === "Online" ? styles.online : styles.offline
            }`}
        >
          Online Status: {status === "Online" ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
