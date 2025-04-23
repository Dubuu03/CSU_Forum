import React from "react";
import DiscussionCard from "./DiscussionCard";
import styles from "../../styles/Home/RecentDiscussions.module.css";
import { motion } from "framer-motion";

const RecentDiscussions = ({ discussions }) => {
  return (
    <div className={styles.recentDiscussions}>
      <span>Recent Discussions</span>
      <motion.div 
        className={styles.discussionList}
        drag="x"
        dragConstraints={{ left: -200, right: 0 }} // Adjust scrolling distance
      >
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
      </motion.div>
    </div>
  );
};

export default RecentDiscussions;
