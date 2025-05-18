import React from "react";
import styles from "../../styles/Community/Discussion.module.css";
import DiscussionPost from "./DiscussionPost";

const DiscussionList = ({ discussions }) => {
  if (!discussions || discussions.length === 0) {
    return (
      <div className={styles.noDiscussions}>
        No discussions yet.
      </div>
    );
  }

  return (
    <div className={styles.discussionContainer}>
      {discussions.map((post, index) => (
        <DiscussionPost key={index} post={post} />
      ))}
    </div>
  );
};

export default DiscussionList;
