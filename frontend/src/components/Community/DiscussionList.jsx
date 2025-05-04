import React from "react";
import DiscussionPost from "../Community/DiscussionPost";
import styles from "../../styles/Community/Discussion.module.css";

const DiscussionList = ({ discussions }) => {
  return (
    <div className={styles.discussionContainer}>
      {discussions.map((post, index) => (
        <DiscussionPost key={index} post={post} />
      ))}
    </div>
  );
};

export default DiscussionList;
