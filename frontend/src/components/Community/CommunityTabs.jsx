import React, { useState } from "react";
import styles from "../../styles/Community/CommunityPage.module.css";

const CommunityTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]); // Default to first tab

  return (
    <nav className={styles.tabs}>
      {tabs.map((tab, index) => (
        <button 
          key={index} 
          className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`} 
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default CommunityTabs;
