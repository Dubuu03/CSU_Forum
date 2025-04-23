import React from "react";
import { motion } from "framer-motion";
import SidebarHeader from "./SidebarHeader";
import CreateCommunityButton from "./CreateCommunityButton";
import MainCommunities from "./MainCommunities";
import OtherCommunities from "./OtherCommunities";
import styles from "../../styles/Sidebar/Sidebar.module.css";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <motion.aside
        className={styles.sidebar}
        initial={{ x: "-100%" }} 
        animate={{ x: isOpen ? "0%" : "-100%" }} 
        transition={{ duration: 0.3, ease: "easeInOut" }} 
      >
        <SidebarHeader onClose={onClose} />
        <CreateCommunityButton />
        <MainCommunities />
        <OtherCommunities />
      </motion.aside>
    </>
  );
};

export default Sidebar;
