import React from "react";
import styles from "../../styles/Community/CommunityPage.module.css";
import Header from "./Header";
import { Dot } from "lucide-react";

const CommunityHeader = ({ name, organizer, date, members, posts, tags }) => {
  return (
    <div className={styles.header}>
      <Header />
      <div className={styles.communityInfo}>
        <button className={styles.joinBtn}>
          Join
        </button>
        <span className={styles.communityName}>{name}</span>
        <div className={styles.organizers}>{organizer} <Dot size={26}/> {date}</div>
        <div className={styles.tags}>
          {tags.map((tag, index) => <span key={index} className={styles.tag}>{tag}</span>)}
        </div>
        <div className={styles.stats}>
          <div className={styles.info}><span>{members}</span> Members</div>
          <div className={styles.info}><span>{posts}</span> Posts</div>
        </div>
      </div>
      
    </div>
  );
};

export default CommunityHeader;
