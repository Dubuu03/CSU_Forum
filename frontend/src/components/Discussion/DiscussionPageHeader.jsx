import React from "react";
import { ChevronLeft, Search } from "lucide-react";
import styles from "../../styles/Discussion/DiscussionPageHeader.module.css";

const DiscussionPageHeader = ({ onBack, communityName, onSearch }) => {
  return (
    <header className={styles.header}>
      <button onClick={onBack} className={styles.backButton}>
        <ChevronLeft size={20} color="#000000"/>
      </button>
      <h1 className={styles.communityName}>{communityName}'s post</h1>
      <button onClick={onSearch} className={styles.searchButton}>
        <Search size={20} color="#000000"/>
      </button>
    </header>
  );
};

export default DiscussionPageHeader;
