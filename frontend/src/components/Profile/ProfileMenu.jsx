import React from "react";
import { Bookmark, Clock, Settings, LogOut } from "lucide-react"; // Icons
import styles from "../../styles/Slider/ProfileSidebar.module.css";

const ProfileMenu = () => {
  return (
    <div className={styles.profileMenu}>
      <ul className={styles.menuList}>
        <li><Bookmark size={20} fill="#434343"/> Saved</li>
        <li><Clock size={20} /> History</li>
        <li><Settings size={20} /> Settings</li>
      </ul>
      <div className={styles.logout}>
        <LogOut size={20} /> Logout
      </div>
    </div>
  );
};

export default ProfileMenu;