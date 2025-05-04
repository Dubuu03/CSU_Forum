import React from "react";
import { Bookmark, Clock, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService"; 
import styles from "../../styles/Slider/ProfileSidebar.module.css";

const ProfileMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");   
  };

  return (
    <div className={styles.profileMenu}>
      <ul className={styles.menuList}>
        <li><Bookmark size={20} fill="#434343" /> Saved</li>
        <li><Clock size={20} /> History</li>
        <li><Settings size={20} /> Settings</li>
      </ul>
      <div className={styles.logout} onClick={handleLogout}>
        <LogOut size={20} /> Logout
      </div>
    </div>
  );
};

export default ProfileMenu;
