import React from "react";
import CommunityCard from "./CommunityCard";
import styles from "../../styles/CommunityCard.module.css"; 

const DiscoverCommunities = ({ communities }) => {
  return (
    <div className={styles.discoverSection}>
      <span>Discover Communities</span>
      <div className={styles.communityList}>
        {communities.map((community, index) => (
          <CommunityCard key={index} {...community} />
        ))}
      </div>
    </div>
  );
};

export default DiscoverCommunities;
