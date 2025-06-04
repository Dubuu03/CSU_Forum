import { motion } from "framer-motion"; // Import motion from framer-motion
import { X } from "lucide-react";
import { useState } from "react"; // Import useState for zoom effect
import useAuthRedirect from "../../hooks/Auth/useAuthRedirect";
import useStudentCollege, { getCollegeShortcut } from "../../hooks/Profile/useStudentCollege";
import useStudentCourse from "../../hooks/Profile/useStudentCourse";
import useStudentPictures from "../../hooks/Profile/useStudentPictures";
import useStudentProfile from "../../hooks/Profile/useStudentProfile";
import styles from "../../styles/Slider/ProfileSidebar.module.css";

const ProfileHeader = ({ onClose }) => {
  const accessToken = useAuthRedirect();
  const { profile } = useStudentProfile(accessToken);
  const { pictures } = useStudentPictures(accessToken);
  const { college } = useStudentCollege(accessToken);
  const { course } = useStudentCourse(accessToken);

  const [isZoomed, setIsZoomed] = useState(false); // State to manage zoom effect

  const FirstName = profile?.FirstName || "Guest";
  const LastName = profile?.LastName || "User";
  const username = `${FirstName} ${LastName}`;
  const profileImageUrl = pictures?.profpic || "";
  const avatarText = profileImageUrl ? "" : FirstName.charAt(0).toUpperCase();
  const collegeShortcut = getCollegeShortcut(college?.label || "");

  const toggleZoom = () => setIsZoomed((prev) => !prev); // Toggle zoom on profile picture

  return (
    <div className={styles.profileHeader}>
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={24} color="#000" />
      </button>
      <div className={styles.userInfo}>
        <div className={styles.profilePicContainer}>
          {profileImageUrl ? (
            <motion.img
              src={profileImageUrl}
              alt="Profile"
              className={styles.profilePic}
              onClick={toggleZoom} // Toggle zoom when clicked
            />
          ) : (
            <div
              className={styles.profilePic}
              onClick={toggleZoom} // Toggle zoom when clicked
            >
              {avatarText || "?"}
            </div>
          )}
        </div>
        <p className={styles.username}>{username}</p>
        <p className={styles.detail}>
          {collegeShortcut} - {course || "Unknown Course"}
        </p>
      </div>

      {/* Show the zoomed image centered when isZoomed is true */}
      {isZoomed && (
        <motion.div
          className={styles.zoomedProfilePicContainer}
          onClick={toggleZoom} // Close zoom on clicking the image itself
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={profileImageUrl}
            alt="Profile"
            className={styles.zoomedProfilePic}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ProfileHeader;
