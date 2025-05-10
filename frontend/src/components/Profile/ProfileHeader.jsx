import React from "react";
import styles from "../../styles/Slider/ProfileSidebar.module.css";
import { X } from "lucide-react";
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import useStudentPictures from "../../hooks/Profile/useStudentPictures";
import useStudentCollege, { getCollegeShortcut } from "../../hooks/Profile/useStudentCollege";
import useStudentCourse from "../../hooks/Profile/useStudentCourse";

const ProfileHeader = ({ onClose }) => {
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const { pictures } = useStudentPictures(accessToken);
  const { college } = useStudentCollege(accessToken);
  const { course } = useStudentCourse(accessToken);

  const FirstName = profile?.FirstName || "Guest";
  const LastName = profile?.LastName || "User";
  const username = `${FirstName} ${LastName}`;
  const profileImageUrl = pictures?.profpic || "";
  const avatarText = profileImageUrl ? "" : FirstName.charAt(0).toUpperCase();
  const collegeShortcut = getCollegeShortcut(college?.label || "");

  return (
    <div className={styles.profileHeader}>
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={24} color="#000" />
      </button>
      <div className={styles.userInfo}>
        <div className={styles.profilePicContainer}>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className={styles.profilePic}
            />
          ) : (
            <div className={styles.profilePic}>{avatarText || "?"}</div>
          )}
        </div>
        <p className={styles.username}>{username}</p>
        <p className={styles.detail}>
          {collegeShortcut} - {course || "Unknown Course"}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
