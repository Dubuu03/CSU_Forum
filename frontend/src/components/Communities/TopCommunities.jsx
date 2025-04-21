import React from "react";
import CommunityCard from "./CommunityCard"; // Import the CommunityCard component
import { motion } from "framer-motion";
import styles from "../../styles/Communities/TopCommunities.module.css"; // Import styles

const TopCommunities = ({ topCommunities }) => {
  return (
    <div className={styles.topCommunitiesSection}>
      <span>Top Communities</span>
      <motion.div 
        className={styles.communityList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        drag="x" 
        dragConstraints={{ left: -200, right: 0 }} // Adjust constraints based on content width
      >
        {topCommunities.map((community, index) => (
          <CommunityCard key={index} {...community} isTopList={true} />
        ))}
      </motion.div>
    </div>
  );
};

export default TopCommunities;
