import React from "react";
import CommunityCard from "./CommunityCard"; // Import the CommunityCard component
import styles from "../../styles/TopCommunities.module.css"; // Import styles

const TopCommunities = ({ topCommunities }) => {
  return (
    <div className={styles.topCommunitiesSection}>
      <span>Top Communities</span>
      <div className={styles.communityList}>
        {topCommunities.map((community, index) => (
          <CommunityCard key={index} {...community} isTopList={true} />
        ))}
      </div>
    </div>
  );
};

export default TopCommunities;
