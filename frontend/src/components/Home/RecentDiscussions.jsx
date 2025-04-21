import React from "react";
import DiscussionCard from "./DiscussionCard";
import styles from "../../styles/Home/RecentDiscussions.module.css";

const RecentDiscussions = ({ discussions }) => {
  return (
    <div className={styles.recentDiscussions}>
      <span>Recent Discussions</span>
      <div className={styles.discussionList}>
        {discussions.map((discussion, index) => (
          <DiscussionCard
            key={index}
            title={discussion.title}
            imageSrc={discussion.imageSrc}
            tags={discussion.tags}
            author={discussion.author}
            date={discussion.date}
            message={discussion.message}
            profileSrc={discussion.profileSrc}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentDiscussions;
