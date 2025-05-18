import React from "react";
import styles from "../../styles/Community/CommunityPage.module.css";
import Header from "./Header";
import { Dot } from "lucide-react";

const CommunityHeader = ({ name, organizer, date, members, posts, tags, onOpenProfileSidebar }) => {
  return (
    <div className={styles.header}>
      <Header onOpenProfileSidebar={onOpenProfileSidebar} />
      <div className={styles.communityInfo}>
        <button className={styles.joinBtn}>Join</button>
        <span className={styles.communityName}>{name}</span>
        <div className={styles.organizers}>{organizer} <Dot size={26} /> {date}</div>
        {Array.isArray(tags) && tags.filter(tag => tag.trim() !== "").length > 0 && (
          <div className={styles.tags}>
            {tags
              .filter(tag => tag.trim() !== "")
              .map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
          </div>
        )}
        <div className={styles.stats}>
          <div className={styles.info}><span>{members}</span> Members</div>
          <div className={styles.info}><span>{posts}</span> Posts</div>
        </div>
      </div>
    </div>
  );
};


export default CommunityHeader;
