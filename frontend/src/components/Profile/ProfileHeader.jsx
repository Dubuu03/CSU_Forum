import React from "react";
import styles from "../../styles/Slider/ProfileSidebar.module.css";
import { X } from "lucide-react";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import useStudentPictures from "../../hooks/Profile/useStudentPictures";  // Import the useStudentPictures hook

const ProfileHeader = ({ onClose }) => {
  const accessToken = useAuthRedirect();
  const { profile, loading, error } = useStudentProfile(accessToken);
  const { pictures, loading: picturesLoading, error: picturesError } = useStudentPictures(accessToken); // Fetch profile pictures using the hook

  const FirstName = profile?.FirstName || "Guest";
  const LastName = profile?.LastName || "User";
  const username = `${FirstName} ${LastName}`;

  const profileImageUrl = pictures?.profpic || "";
  const avatarText = profileImageUrl ? "" : FirstName.charAt(0).toUpperCase(); // First letter of the first name if no image

  const status = "Online";

  return (
    <div className={styles.profileHeader}>
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={24} color="#000" />
      </button>
      <div className={styles.userInfo}>
        <div className={styles.profilePicContainer}>
          {/* Show the profile image if available, otherwise show the initial letter */}
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className={styles.profilePic}
            />
          ) : (
            <div className={styles.profilePic}>
              {avatarText || "?"} {/* Display the first letter of the name or "?" if no name */}
            </div>
          )}
        </div>
        <p className={styles.username}>{username}</p>
        <span
          className={`${styles.status} ${status === "Online" ? styles.online : styles.offline}`}
        >
          Online Status: {status === "Online" ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
