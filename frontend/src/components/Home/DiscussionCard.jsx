import React from "react";
import styles from "../../styles/Home/RecentDiscussions.module.css";
import { Dot } from "lucide-react";

const DiscussionCard = ({ title, imageSrc, tags, author, date, message, profileSrc }) => {
  return (
    <div className={styles.discussionCard}>
      <img src={imageSrc} alt={title} className={styles.discussionImage} />
      <div className={styles.discussionContent}>
        <p className={styles.title}>{title}</p>
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.details}>
          <div className={styles.authorDetails}>
            <div className={styles.profile}>
              <img src={profileSrc} alt="Profile" className={styles.profileImage} />
            </div>
            <p className={styles.author}>{author}</p>
            <Dot size={16} color="#000" className={styles.dot} />
            <p className={styles.date}>{date}</p>
          </div>
          <div className={styles.comment}>
            <p className={styles.message}>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
