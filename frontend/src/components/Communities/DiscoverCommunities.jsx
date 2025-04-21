import React from "react";
import CommunityCard from "./CommunityCard";
import { motion } from "framer-motion";
import styles from "../../styles/CommunityCard.module.css";

const DiscoverCommunities = ({ communities }) => {
  return (
    <div className={styles.discoverSection}>
      <span>Discover Communities</span>
      <motion.div 
        className={styles.communityList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        drag="x"
        dragConstraints={{ left: -200, right: 0 }} // Adjust constraints based on content width
      >
        {communities.map((community, index) => (
          <CommunityCard key={index} {...community} />
        ))}
      </motion.div>
    </div>
  );
};

export default DiscoverCommunities;
