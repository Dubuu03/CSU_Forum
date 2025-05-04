import React from "react";
import styles from "../../styles/Slider/Sidebar.module.css";
import csunite from  '../../assets/logov3.png';
import projName from '../../assets/proj-name.png';
import { X } from "lucide-react";

const SidebarHeader = ({ onClose }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLogo}>
        <img src={csunite} alt="CSUnite Logo" className={styles.logo} />
        <img src={projName} alt="Project Name" className={styles.projName} />
      </div>
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={24} />
      </button>
    </div>
  );
};

export default SidebarHeader;
